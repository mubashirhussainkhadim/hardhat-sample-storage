const { task } = require("hardhat/config")

task("block-number", "prints the current block number").setAction(
    async (taskArgs, hre) => {
        const blockNumber = hre.ethers.proviider.getBlockNumber()
        console.log(`Current Block number: ${blockNumber}`)
    }
)