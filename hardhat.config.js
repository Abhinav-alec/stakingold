require("@nomicfoundation/hardhat-toolbox");
require("events").EventEmitter.defaultMaxListeners = 20;
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // amoy: {
    //   url: "https://polygon-amoy.infura.io/v3/ac08c78a53bb47528141efa7f6e70b8a",
    //   accounts: [process.env.MAIN_ACCOUNT],
    //   chainId: 80002,
    // },
    sepoliaETH: {
      url: "https://sepolia.infura.io/v3/ac08c78a53bb47528141efa7f6e70b8a",
      accounts: [process.env.MAIN_ACCOUNT],
      chainId: 11155111,
    },
    // etherscan: {
    //   apiKey: {
    //     goerli: process.env.ETHERSCAN_API_KEY,
    //   },
    // },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",

    token: "matic",
    outputFile: "gasReports.txt",
    noColors: true,
  },
};
