/* eslint-disable no-await-in-loop */
/* eslint-disable no-console, no-inner-declarations, no-undef, import/no-unresolved */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { ethers } = require('hardhat');

// const mainnetBridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
// const testnetBridgeAddress = '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7';

const mekrleProofString = '/merkle-proof';
const getClaimsFromAcc = '/bridges/';

const pathdeployeERC20Bridge = path.join(__dirname, '../deployment/ERC20Bridge_output.json');
const deploymentERC20Bridge = require(pathdeployeERC20Bridge);

async function main() {
    const currentProvider = ethers.provider;
    let deployer;
    if (process.env.PVTKEY) {
        deployer = new ethers.Wallet(process.env.PVTKEY, currentProvider);
        console.log('Using pvtKey deployer with address: ', deployer.address);
    } else if (process.env.MNEMONIC) {
        deployer = ethers.Wallet.fromMnemonic(process.env.MNEMONIC, 'm/44\'/60\'/0\'/0/0').connect(currentProvider);
        console.log('Using MNEMONIC deployer with address: ', deployer.address);
    } else {
        [deployer] = (await ethers.getSigners());
    }

    let zkEVMBridgeContractAddress;
    let baseURL;
    const networkName = process.env.HARDHAT_NETWORK;

    if(networkName === "sepolia") {
        zkEVMBridgeContractAddress = "0x60C171F5Cd2d698Cbb270b6046e1661b65862d24";
        baseURL = 'https://bridgeapi.moduluszk.io';
    } else if(networkName === "modulus") {
        zkEVMBridgeContractAddress = "0xf8a6815D12F4ba6a8Eb9C92a13CBAe1fBEfa4ee5";
        baseURL = 'https://bridgeapi.moduluszk.io';
    }

    const axios = require('axios').create({
        baseURL,
    });

    const bridgeFactoryZkeEVm = await ethers.getContractFactory('ModulusZkEVMBridge', deployer);
    const bridgeContractZkeVM = bridgeFactoryZkeEVm.attach(zkEVMBridgeContractAddress);

    let ERC20BridgeContractAddress;
    if (networkName === 'modulus') {
        ERC20BridgeContractAddress = deploymentERC20Bridge.ERC20BridgezkEVM;
    }

    if (networkName === 'mainnet' || networkName === 'sepolia') {
        ERC20BridgeContractAddress = deploymentERC20Bridge.ERC20BridgeMainnet;
    }

    const depositAxions = await axios.get(getClaimsFromAcc + ERC20BridgeContractAddress, { params: { limit: 100, offset: 0 } });
    const depositsArray = depositAxions.data.deposits;

    console.log("Deposit api response ", networkName, depositsArray);

    if (depositsArray.length === 0) {
        console.log('Not deposits yet!');
        return;
    }

    for (let i = 0; i < depositsArray.length; i++) {
        const currentDeposit = depositsArray[i];
        if (currentDeposit.ready_for_claim) {
            if (currentDeposit.claim_tx_hash != '') {
                console.log('already claimed: ', currentDeposit.claim_tx_hash);
                continue;
            }

            const proofAxios = await axios.get(mekrleProofString, {
                params: { deposit_cnt: currentDeposit.deposit_cnt, net_id: currentDeposit.orig_net },
            });

            const { proof } = proofAxios.data;
            const claimTx = await bridgeContractZkeVM.claimMessage(
                proof.merkle_proof,
                currentDeposit.deposit_cnt,
                proof.main_exit_root,
                proof.rollup_exit_root,
                currentDeposit.orig_net,
                currentDeposit.orig_addr,
                currentDeposit.dest_net,
                currentDeposit.dest_addr,
                currentDeposit.amount,
                currentDeposit.metadata,
            );
            console.log('claim message succesfully send: ', claimTx.hash);
            await claimTx.wait();
            console.log('claim message succesfully mined');
        } else {
            console.log('Not ready yet!');
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
