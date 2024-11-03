const { ethers, network } = require("hardhat");
const { expect } = require("chai");

const SECONDS_IN_A_DAY = 86400;

async function moveBlocks(amount) {
  console.log("Moving blocks...");
  for (let index = 0; index < amount; index++) {
    await network.provider.send("evm_mine", []);
  }
  console.log(`Moved ${amount} blocks.`);
}

async function moveTime(amount) {
  console.log("Moving time...");
  await network.provider.send("evm_increaseTime", [amount]);
  console.log(`Moved forward in time ${amount} seconds.`);
}

describe("Staking Tests", function () {
  let staking, rewardToken;
  let deployer; // Declare deployer variable
  let stakeAmount;

  beforeEach(async function () {
    const accounts = await ethers.getSigners();
    deployer = accounts[0]; // Assign deployer in beforeEach

    // Deploy the reward token contract
    const RewardToken = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardToken.deploy();
    await rewardToken.deployed();

    // Deploy the staking contract
    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(rewardToken.address, rewardToken.address);
    await staking.deployed();

    // Define the stake amount (100,000 tokens)
    stakeAmount = ethers.utils.parseEther("100000");

    // Approve and stake tokens for deployer
    await rewardToken.approve(staking.address, stakeAmount);
    await staking.stake(stakeAmount);
  });

  it("should accumulate earned tokens over time", async function () {
    const deployerAddress = await deployer.getAddress();

    // Check initial earned balance
    let startingEarned = await staking.earned(deployerAddress);
    console.log(
      `Starting Earned: ${ethers.utils.formatEther(startingEarned)} tokens`
    );

    // Move forward in time and mine a block
    await moveTime(SECONDS_IN_A_DAY); // Advance 1 day
    await moveBlocks(1);

    // Check earned balance after time advancement
    let endingEarned = await staking.earned(deployerAddress);
    console.log(
      `Ending Earned after 1 day: ${ethers.utils.formatEther(
        endingEarned
      )} tokens`
    );

    // Calculate expected reward for 100,000 tokens staked
    const expectedReward = stakeAmount // 100,000 tokens in wei
      .mul(ethers.BigNumber.from(SECONDS_IN_A_DAY)) // Multiply by seconds in a day
      .div(ethers.BigNumber.from(1e18)); // Adjust according to the reward rate

    console.log(
      `Expected Reward: ${ethers.utils.formatEther(expectedReward)} tokens`
    );

    expect(startingEarned).to.be.equal(0);
    expect(endingEarned).to.be.closeTo(
      expectedReward,
      ethers.utils.parseEther("1") // Allow a margin of 1 token
    );
  });
});
