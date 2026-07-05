# Par ou Impar | EVM Signature Lab

Projeto em Hardhat com contrato Solidity para:

- verificar se um numero e par ou impar
- registrar estatisticas de uso por endereco
- emitir eventos on-chain
- transferir ownership com erro customizado
- recuperar assinaturas EVM com `ecrecover`

O repositorio esta organizado para publicacao no GitHub, execucao local, testes automatizados e deploy na rede Sepolia.

## Stack

- Solidity `0.8.28`
- Hardhat
- TypeScript
- Ethers v6
- Chai

## Funcionalidades do contrato

O contrato `OddOrEven.sol` expone:

- `isEven(uint256)`: verifica se um numero e par
- `isOdd(uint256)`: verifica se um numero e impar
- `checkNumber(uint256)`: calcula o resultado, incrementa contadores e emite evento
- `getUserChecks(address)`: retorna quantas verificacoes um endereco executou
- `transferOwnership(address)`: transfere ownership com validacao
- `recoverSigner(bytes32,uint8,bytes32,bytes32)`: recupera o signatario a partir de uma assinatura
- `getEthSignedMessageHash(bytes)`: gera o hash padrao de mensagem assinada no Ethereum

Eventos e erros customizados:

- `NumberChecked`
- `OwnerChanged`
- `NotOwner`
- `ZeroAddressNotAllowed`

## Estrutura do projeto

```text
Par-ou-Impar/
├── contracts/
│   └── OddOrEven.sol
├── ignition/
│   └── modules/
│       └── OddOrEven.ts
├── scripts/
│   └── deploy.ts
├── test/
│   ├── OddOrEven.test.ts
│   └── OddOrEven.t.sol
├── .env.example
├── .gitignore
├── hardhat.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Requisitos

- Node.js 18+
- npm 9+

## Instalacao

```bash
npm install
cp .env.example .env
```

## Variaveis de ambiente

Preencha o arquivo `.env` com:

```bash
SEPOLIA_PRIVATE_KEY=coloque_sua_chave_privada_aqui
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
ETHERSCAN_API_KEY=coloque_sua_chave_etherscan_aqui
```

Observacoes:

- a chave privada pode ser informada com ou sem prefixo `0x`
- para deploy local, o `.env` nao e obrigatorio

## Scripts disponiveis

```bash
npm run clean
npm run compile
npm test
npm run test:mainnet
npm run deploy:sepolia
npm run verify:sepolia -- <ENDERECO>
npm run ignition:sepolia
```

## Fluxo recomendado

1. Instale as dependencias com `npm install`
2. Compile com `npm run compile`
3. Rode os testes com `npm test`
4. Configure `.env`
5. Faca o deploy com `npm run deploy:sepolia`
6. Verifique o contrato com `npm run verify:sepolia -- <ENDERECO>`

## Deploy publicado

Contrato ja publicado e verificado na Sepolia:

- Endereco: `0x09020FD0EE146056d6a19768057F5c77D32F4Ea0`
- Explorer: `https://sepolia.etherscan.io/address/0x09020FD0EE146056d6a19768057F5c77D32F4Ea0#code`

## Testes

O projeto possui cobertura de comportamento para:

- deploy e ownership
- funcoes puras `isEven` e `isOdd`
- eventos e mudanca de estado em `checkNumber`
- rastreamento de `totalChecks` e `userChecks`
- erro customizado para ownership
- recuperacao de assinatura EVM
- calculo de `v` conforme EIP-155

## Publicacao no GitHub

O repositorio remoto `https://github.com/Jistriane/Par-ou-Impar.git` esta vazio no momento. Depois de revisar os arquivos locais, publique com:

```bash
git init
git add .
git commit -m "chore: initialize Par ou Impar Hardhat project"
git branch -M main
git remote add origin https://github.com/Jistriane/Par-ou-Impar.git
git push -u origin main
```

## Licenca

MIT
