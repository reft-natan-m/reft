import { ethers } from "hardhat";
import { getAccountBalance } from "./utils";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying contracts with the following account address: ${deployer.address}`);
  console.log(`Deployer Account Balance: ${await getAccountBalance(deployer)} ETH`);

  const token = await ethers.deployContract("RealEstateFungibleToken");

  console.log(`Token deployed to address: ${await token.getAddress()}`);
  console.log(`Deployer Account Balance: ${await getAccountBalance(deployer)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
