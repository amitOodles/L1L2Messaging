require('dotenv').config();
require('@nomiclabs/hardhat-waffle');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('@nomiclabs/hardhat-etherscan');
require('@openzeppelin/hardhat-upgrades');

const DEFAULT_MNEMONIC = 'test test test test test test test test test test test junk';

/*
 * You need to export an object to set up your config
 * Go to https://hardhat.org/config/ to learn more
 */

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999
          }
        }
      }
    ]
  },
  networks: {
    modulus: {
      url: "https://rpc.moduluszk.io",
      accounts: {
        mnemonic: process.env.MNEMONIC || DEFAULT_MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
  },
  etherscan: {
    apiKey: {
      // DO NOT CHANGE
      modulus: "random",
    },
    customChains: [
      {
        network: "modulus",
        chainId: 6666,
        urls: {
          apiURL: "https://eye.moduluszk.io/api",
          browserURL: "https://eye.moduluszk.io"
        }
      }
    ]
  },
};