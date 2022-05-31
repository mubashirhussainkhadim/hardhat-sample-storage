// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers, run, network } = require("hardhat");
require("@nomiclabs/hardhat-etherscan");
async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("deploy Contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed contract to : ${simpleStorage.address}`)
  // console(network.config)
  if (network.config.chainId === 4 && process.env.ETHERSCAN_APIKEY) {
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }
  let currentValue = await simpleStorage.retrieve()
  console.log(`Current value: ${currentValue}`)
  console.log("Updating contract...")
  let transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait() // returns transaction receipt
  currentValue = await simpleStorage.retrieve()
  console.log(`Current value: ${currentValue}`)
}
async function verify(contractAddress, args) {
  console.log("verifying contract")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args
    })
  }
  catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("already Verified")
    } else {
      console.log(e)
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
