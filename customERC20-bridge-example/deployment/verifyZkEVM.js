/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require, no-await-in-loop, no-restricted-syntax, guard-for-in */
require('dotenv').config();
const path = require('path');
const hre = require('hardhat');
const { expect } = require('chai');

const networkIDMainnet = 0;

async function main() {
    const networkName = process.env.HARDHAT_NETWORK;
    const pathDeployOutputParameters = path.join(__dirname, './ERC20Bridge_output.json');
    const deployOutputParameters = require(pathDeployOutputParameters);

    let zkEVMBridgeContractAddress;
    if (networkName === 'modulus') {
        zkEVMBridgeContractAddress = "0xf8a6815D12F4ba6a8Eb9C92a13CBAe1fBEfa4ee5";
    }

    // Token params
    const name = deployOutputParameters.tokenName;
    const symbol = deployOutputParameters.tokenSymbol;
    const initialAccount = deployOutputParameters.deployerAddress;
    const initialBalance = deployOutputParameters.tokenInitialBalance;

    try {
        // verify token mainnet
        await hre.run(
            'verify:verify',
            {
                address: deployOutputParameters.erc20zkEVMToken,
                constructorArguments: [
                    name,
                    symbol,
                    initialAccount,
                    initialBalance,
                    deployOutputParameters.ERC20BridgezkEVM,
                ],
            },
        );
    } catch (error) {
        console.log("error message", error)
        // expect(error.message.toLowerCase().includes('already verified')).to.be.equal(true);
    }

    try {
        // verify ERC20BridgeNonNativeChain
        await hre.run(
            'verify:verify',
            {
                address: deployOutputParameters.ERC20BridgezkEVM,
                constructorArguments: [
                    zkEVMBridgeContractAddress,
                    deployOutputParameters.ERC20BridgeMainnet,
                    networkIDMainnet,
                    deployOutputParameters.erc20zkEVMToken,
                ],
            },
        );
    } catch (error) {
        // expect(error.message.toLowerCase().includes('already verified')).to.be.equal(true);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
