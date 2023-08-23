// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require('@openzeppelin/hardhat-upgrades');
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { task } = require("hardhat/config");

task("account", "returns nonce and balance for specified address on multiple networks")
  .addParam("address")
  .setAction(async address => {
    const web3Goerli = createAlchemyWeb3(`https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_GOERLI}`);
    const web3Mainnet = createAlchemyWeb3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_ETHEREUM}`);
    const web3Mumbai = createAlchemyWeb3(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_MATIC}`);

    const networkIDArr = ["Ethereum Goerli:", "Ethereum  Mainnet:", "Polygon  Mumbai:"]
    const providerArr = [web3Goerli, web3Mainnet, web3Mumbai];
    const resultArr = [];
    
    for (let i = 0; i < providerArr.length; i++) {
      const nonce = await providerArr[i].eth.getTransactionCount(address.address, "latest");
      const balance = await providerArr[i].eth.getBalance(address.address)
      resultArr.push([networkIDArr[i], nonce, parseFloat(providerArr[i].utils.fromWei(balance, "ether")).toFixed(2) + "ETH"]);
    }
    resultArr.unshift(["  |NETWORK|   |NONCE|   |BALANCE|  "])
    console.log(resultArr);
  });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
      {
        version: "0.7.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
        },
      },
    ],
  },
  networks: {
    // localhost: {
    //   url: "http://127.0.0.1:8545"
    // },
    hardhat: {
      // Forking MATIC
      forking: {
        url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
        blockNumber: 9057308,
      },
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_GOERLI}`,
      accounts: [process.env.PVTKEY],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_SEPOLIA}`,
      gasPrice: 8000000000,
      accounts: [process.env.PVTKEY],
    },
    testbinance: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      //gasPrice: 20000000000,
      accounts: [process.env.PVTKEY]
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_MATIC}`,
      chainId: 80001,
      gasPrice: 8000000000,
      accounts: [process.env.PVTKEY]
    },
    modulus: {
      url: `https://rpc.moduluszk.io`,
      chainId: 6666,
      gasPrice: 8000000000,
      accounts: [process.env.PVTKEY],
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 20,
    },
    modulusDevnet: {
      url: `http://34.243.78.118:8123`,
      chainId: 6665,
      gasPrice: 8000000000,
      accounts: [process.env.PVTKEY],
      path: "m/44'/60'/0'/0",
      initialIndex: 0,
      count: 20,
    },
    ethereum: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_ETHEREUM}`,
      accounts: [process.env.PVTKEY],
    },
    // binance: {
    //   url: "https://bsc-dataseed.binance.org/",
    //   chainId: 56,
    //   accounts: {mnemonic: process.env.MNEMONIC}
    // }
  },
  etherscan: {
    //apiKey: process.env.ETHERSCAN_API_KEY
    //apiKey: process.env.BSCSCAN_API_KEY
    //apiKey: process.env.POLYGONSCAN_API_KEY,
    apiKey: {
      modulus: "random",
      modulusDevnet : "random"
    },
    customChains: [
      {
        network: "modulus",
        chainId: 6666,
        urls: {
          apiURL: "https://eye.moduluszk.io/api",
          browserURL: "https://eye.moduluszk.io"
        }
      },
      {
        network: "modulusDevnet",
        chainId: 6665,
        urls: {
          apiURL: "https://5262-103-215-158-90.ngrok-free.app/api-docs",
          browserURL: "https://5262-103-215-158-90.ngrok-free.app"
        }
      }
    ]
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS == 'true') ? true : false,
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  // contractSizer: {
  //   strict: true
  // },
  mocha: {
    timeout: 240000,
  }
};
