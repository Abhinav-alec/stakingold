const { ethers } = require("hardhat");

async function main() {
  // Deploy RewardToken contract
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.deployed();
  console.log("RewardToken contract deployed to:", rewardToken.address);

  // Deploy Staking contract with RewardToken address as parameter
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(
    rewardToken.address,
    rewardToken.address
  );
  await staking.deployed();
  console.log("Staking contract deployed to:", staking.address);
}

// Execute the main function and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
