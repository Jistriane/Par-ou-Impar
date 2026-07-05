import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("=================================================");
  console.log(" Deploy: OddOrEven Contract");
  console.log("=================================================");
  console.log(" Network:", hre.network.name);
  console.log(" Deployer:", deployer.address);
  console.log(
    " Balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );
  console.log("-------------------------------------------------");

  const OddOrEvenFactory = await ethers.getContractFactory("OddOrEven");
  const oddOrEven = await OddOrEvenFactory.deploy();
  await oddOrEven.waitForDeployment();

  const address = await oddOrEven.getAddress();
  const deploymentTx = oddOrEven.deploymentTransaction();

  console.log(" OddOrEven deployed!");
  console.log(" Address:", address);
  if (deploymentTx) {
    console.log(" Tx Hash:", deploymentTx.hash);
  }
  console.log("-------------------------------------------------");
  console.log("\n Para verificar na Sepolia:");
  console.log(` npm run verify:sepolia -- ${address}`);
  console.log("=================================================");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
