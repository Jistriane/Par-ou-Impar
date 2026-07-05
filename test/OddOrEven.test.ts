import { expect } from "chai";
import { ethers } from "hardhat";

describe("OddOrEven", function () {
  let oddOrEven: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const OddOrEvenFactory = await ethers.getContractFactory("OddOrEven");
    oddOrEven = await OddOrEvenFactory.deploy();
    await oddOrEven.waitForDeployment();
  });

  describe("Deployment", function () {
    it("deve definir o deployer como owner", async function () {
      expect(await oddOrEven.owner()).to.equal(owner.address);
    });

    it("deve inicializar totalChecks como 0", async function () {
      expect(await oddOrEven.totalChecks()).to.equal(0n);
    });
  });

  describe("isEven() - pure", function () {
    it("0 deve ser par", async function () {
      expect(await oddOrEven.isEven(0n)).to.equal(true);
    });

    it("1 deve ser impar", async function () {
      expect(await oddOrEven.isEven(1n)).to.equal(false);
    });

    it("1000000 deve ser par", async function () {
      expect(await oddOrEven.isEven(1_000_000n)).to.equal(true);
    });
  });

  describe("isOdd() - pure", function () {
    it("1 deve ser impar", async function () {
      expect(await oddOrEven.isOdd(1n)).to.equal(true);
    });

    it("2 deve ser par (not odd)", async function () {
      expect(await oddOrEven.isOdd(2n)).to.equal(false);
    });

    it("isEven e isOdd devem ser sempre opostos", async function () {
      for (let i = 0n; i < 20n; i++) {
        const even = await oddOrEven.isEven(i);
        const odd = await oddOrEven.isOdd(i);
        expect(even).to.not.equal(odd);
      }
    });
  });

  describe("checkNumber() - altera estado", function () {
    it("deve retornar os valores corretos para numero par", async function () {
      const result = await oddOrEven.connect(addr1).checkNumber.staticCall(42n);

      expect(result.evenResult).to.equal(true);
      expect(result.result).to.equal("Even");
    });

    it("deve retornar os valores corretos para numero impar", async function () {
      const result = await oddOrEven.connect(addr1).checkNumber.staticCall(7n);

      expect(result.evenResult).to.equal(false);
      expect(result.result).to.equal("Odd");
    });

    it("deve emitir evento para numero par", async function () {
      const tx = await oddOrEven.connect(addr1).checkNumber(42n);

      await expect(tx)
        .to.emit(oddOrEven, "NumberChecked")
        .withArgs(addr1.address, 42n, true, "Even");
    });

    it("deve emitir evento para numero impar", async function () {
      const tx = await oddOrEven.connect(addr1).checkNumber(7n);

      await expect(tx)
        .to.emit(oddOrEven, "NumberChecked")
        .withArgs(addr1.address, 7n, false, "Odd");
    });

    it("deve incrementar totalChecks", async function () {
      expect(await oddOrEven.totalChecks()).to.equal(0n);

      await oddOrEven.connect(addr1).checkNumber(2n);
      await oddOrEven.connect(addr1).checkNumber(3n);
      await oddOrEven.connect(addr2).checkNumber(4n);

      expect(await oddOrEven.totalChecks()).to.equal(3n);
    });

    it("deve rastrear userChecks por endereco", async function () {
      await oddOrEven.connect(addr1).checkNumber(1n);
      await oddOrEven.connect(addr1).checkNumber(2n);
      await oddOrEven.connect(addr2).checkNumber(3n);

      expect(await oddOrEven.getUserChecks(addr1.address)).to.equal(2n);
      expect(await oddOrEven.getUserChecks(addr2.address)).to.equal(1n);
    });
  });

  describe("Ownership", function () {
    it("deve permitir transferencia de ownership pelo owner", async function () {
      await expect(oddOrEven.connect(owner).transferOwnership(addr1.address))
        .to.emit(oddOrEven, "OwnerChanged")
        .withArgs(owner.address, addr1.address);

      expect(await oddOrEven.owner()).to.equal(addr1.address);
    });

    it("deve rejeitar transferencia por non-owner", async function () {
      await expect(
        oddOrEven.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWithCustomError(oddOrEven, "NotOwner");
    });

    it("deve rejeitar address zero como novo owner", async function () {
      await expect(
        oddOrEven.connect(owner).transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(oddOrEven, "ZeroAddressNotAllowed");
    });
  });

  describe("Assinatura EVM - ecrecover", function () {
    it("deve gerar o mesmo hash de mensagem assinado pelo ethers", async function () {
      const message = "Par ou Impar - Aula 06";
      const onChainHash = await oddOrEven.getEthSignedMessageHash(
        ethers.toUtf8Bytes(message)
      );

      expect(onChainHash).to.equal(ethers.hashMessage(message));
    });

    it("deve recuperar o endereco do signatario", async function () {
      const message = "Par ou Impar - Aula 06";
      const messageHash = ethers.hashMessage(message);
      const signature = await addr1.signMessage(message);
      const sig = ethers.Signature.from(signature);

      const recovered = await oddOrEven.recoverSigner(
        messageHash,
        sig.v,
        sig.r,
        sig.s
      );

      expect(recovered).to.equal(addr1.address);
    });

    it("deve demonstrar calculo de v conforme EIP-155", function () {
      const calcV = (chainId: number, recoveryId: number): number =>
        recoveryId + chainId * 2 + 35;

      expect(calcV(1, 0)).to.equal(37);
      expect(calcV(1, 1)).to.equal(38);
      expect(calcV(97, 0)).to.equal(229);
      expect(calcV(97, 1)).to.equal(230);
    });
  });
});
