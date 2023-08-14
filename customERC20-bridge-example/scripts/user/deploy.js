// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.const fsp  = require("fs").promises;
const fsp  = require("fs").promises;
const path = require('path');
const hre = require("hardhat");
const { runInContext } = require('vm');
const { ethers, upgrades } = hre;

const zeroAddress = ethers.constants.AddressZero;

// const { encoder, create2Address } = require("./utils");
const abiCoder = new ethers.utils.AbiCoder();
// console.log("ENCODEEEEEEEEEEEEEEEEE", abiCoder.encode([ "uint", "string" ], [ 1234, "Hello World" ]));
// return;

// const STONE_BYTECODE = require("../artifacts/contracts/STONE.sol/STONE.json").bytecode;
const STONE_BYTECODE = require("../../artifacts/contracts/user/STONE.sol/STONE.json").bytecode;
// const VESTING_FACTORY_BYTECODE = require("../artifacts/contracts/VestingFactory.sol/VestingFactory.json").bytecode;

const DEPLOY_CONTRACTS = [
  {
    name: "STONE",
    bytecode: STONE_BYTECODE,
    types: ["address"],
    args: [
      // "0x16B09EB22A3AEf231617fBFA8a18aE066e8979BA"
      "0x35F1163616D60AEBBE761dcfaB7dFC8869755A6B"
    ]
  },
  // {
  //   name: "VestingFactory",
  //   bytecode: VESTING_FACTORY_BYTECODE,
  //   types: [],
  //   args: []
  // }
];

const INSTANCES_STORE = path.resolve(__dirname, "../deployed_instances.json");

const ownerAddress = "0x6892eb9cd308848B9E746a637852b9180f798543";//"0x115A8405B51F3D98b6f470Bc6EDcf10e76D92C93";
const stoneFee = 3000;
const cultFee = 3000;

//goerli
//mainnet: 0xd139ecD0047407Df4EF5709F7Ac99cE719CF332c
//goerli: 0x604538Caca869Ca16093f828b072Cf20CE446A28
const vstoneAddress = "0x604538Caca869Ca16093f828b072Cf20CE446A28";
const wethAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const cultAddress = "0x89e11DC1970687Dd72602ddAea25A912898260bD";
const uniFactory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

const vestM = "0xC7A9BeBbc87A919b21C894c09fE41aa27C16793b";
const vestF = "0xBF55333250dE59f51aF925cc6a95e5aF53bdFb91";
// cult/weth pool should be: 0x7ffd6221992558f3a8dac5bb930532e1635212ad
// stone/weth pool should be: 0xF66BB178A15a6B5b1B9292eDD24a9F3C63D3DF87

//mumbai
// const vstoneAddress = "0x565C13eA155b03cb247F477C32e21D73A3aC21FE";
// const wethAddress = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";
// const cultAddress = "0x89e11DC1970687Dd72602ddAea25A912898260bD";
// const uniFactory = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
// cult/weth pool should be: 0x7ffd6221992558f3a8dac5bb930532e1635212ad
// stone/weth pool should be: 0xF66BB178A15a6B5b1B9292eDD24a9F3C63D3DF87

async function main() {

  let instances = {};
  let confirmations = [];
  let implAddr = {};

  const factoryAddr = "0xb47555EA22FA6E9C171D2A8B91b67f7294379f59";
  const saltHex = ethers.utils.id("1992");//main deployed with 1992

  //const factory = await ethers.getContractAt('DeterministicDeployFactory', factoryAddr);
  // const Factory = await ethers.getContractFactory("DeterministicDeployFactory");
  // const factory = await Factory.attach(factoryAddr);
  const factory = await ethers.getContractAt("DeterministicDeployFactory", factoryAddr);
  console.log("FCCCCCCCCCCCC", factory);
  // return;

  //DEPLOY SCRIPT//
  // const lockDeploy = await factory.deploy(initCode, saltHex);
  // const txReceipt = await lockDeploy.wait();
  // console.log("Deployed to:", txReceipt.events[0].args[0]);

  console.log("****************************************************************");
  console.log(`deploying ${DEPLOY_CONTRACTS.length} contracts...`);
  console.log("****************************************************************");

  //PRE-COMPUTE-ADDRESS NO-DEPLOY

  // for(let contract of DEPLOY_CONTRACTS){
  //   let initCode = contract.bytecode + encoder(contract.types, contract.args);
  //   const create2Addr = create2Address(factoryAddr, saltHex, initCode);
  //   console.log("CONTRACT: ", contract.name);
  //   console.log("COMPUTED_ADDRESS: ", create2Addr);
  // }

  //PRE-COMPUTE-ADDRESS WITH-DEPLOY
  for(let contract of DEPLOY_CONTRACTS){

    // let initCode = contract.bytecode + encoder(contract.types, contract.args);
    let initCode = contract.bytecode + abiCoder.encode(contract.types, contract.args).slice(2,);
    console.log("Encoded value ", abiCoder.encode(contract.types, contract.args).slice(2,))
    // console.log("Init code ", initCode.length, initCode); 
    // const create2Addr = create2Address(factoryAddr, saltHex, initCode);
    let initCodeHash = ethers.utils.keccak256(initCode);
    // let initCodeHash = "0xd60a7c95889bca839fdc7c651aed0e908416f8184a0b0e2be993cde90b75474f";
    // console.log("INIT CODDE HASHHHHHHHHHHHHHHH", initCodeHash);
    // return;
    const create2Addr = ethers.utils.getCreate2Address(factoryAddr, saltHex, initCodeHash);
    console.log("CONTRACT: ", contract.name);
    console.log("COMPUTED_ADDRESS: ", create2Addr);
    console.log("SALTTTTTTTTTTTTTTTTTTTTTT", saltHex);

    const contractDeploy = await factory.deploy(initCode, saltHex);
    const txReceipt = await contractDeploy.wait(1);
    //console.log("alkdksa: ", await txReceipt.events[0].args[0]);

    instances[contract.name] = create2Addr;
    // let cfm = await contractDeploy.deployTransaction.wait(5);
    confirmations.push(txReceipt);

    console.log("DEPLOYED_ADDRESS: ", create2Addr);
    //console.log("TX_HASH: ", contractDeploy.deployTransaction.hash);

    console.log("");
  }

  console.log(`waiting for confirmations...`);
  let allDeployed = await Promise.allSettled(confirmations);

  console.log("");
  console.log("****************************************************************");
  console.log(`Verifying ${DEPLOY_CONTRACTS.length} contracts...`);
  console.log("****************************************************************");

  return;

  //VERIFY IMPLEMENTATIONS
  let i = 0;
  retry:for(; i<DEPLOY_CONTRACTS.length ; i++){
    try{
      await run("verify:verify",{
        address: instances[DEPLOY_CONTRACTS[i].name],
        constructorArguments: DEPLOY_CONTRACTS[i].args
      });
      console.log(`${DEPLOY_CONTRACTS[i].name} verified successfully`);
    }catch(e){
      if(e.message.includes("already verified")){
        console.log(`${DEPLOY_CONTRACTS[i].name} is already verified`);
      }else{
        console.error(`${DEPLOY_CONTRACTS[i].name}: verification failed`);
        console.error(`reason: ${e.message}`);
        //retry
        console.log("Failed Verification, Retrying...");
        i-=1;
        continue retry;
      }
    }
  }
  
  // await fsp.writeFile(INSTANCES_STORE, JSON.stringify(instances, null, 4));
  // console.log(`List of proxies stored in ${INSTANCES_STORE}`);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
const delay = ms => new Promise(res => setTimeout(res, ms));
