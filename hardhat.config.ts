import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

function normalizePrivateKey(privateKey?: string): string | undefined {
  if (!privateKey) return undefined;
  return privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
}

const PRIVATE_KEY = normalizePrivateKey(process.env.SEPOLIA_PRIVATE_KEY);
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris",
    },
  },

  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    hardhatMainnet: {
      url: "http://127.0.0.1:8545",
      chainId: 1,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      chainId: 11155111,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },

  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;
