const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { ethers } = require('hardhat');

async function deployStoneFactory(){
    try{
        let zkEVMProvider = new ethers.providers.JsonRpcProvider('http://34.243.78.118:8123');
        let deployerZkEVM;
        if (process.env.PVTKEY) {
            deployerZkEVM = new ethers.Wallet(process.env.PVTKEY, zkEVMProvider);
            console.log('Using pvtKey deployer with address: ', deployerZkEVM.address);
        }

        // deploy mainnet token
        const DDFFactory = await ethers.getContractFactory('DeterministicDeployFactory', deployerZkEVM);
        const DDFContract = await DDFFactory.deploy();
        await DDFContract.deployed();
        console.log('DDF deployed at', DDFContract.address);
    } catch(ex) {
        console.log("Error deploying DDF contract", ex);
    }
}

deployStoneFactory();