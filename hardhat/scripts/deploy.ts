import { ethers } from "hardhat";
import { Signer } from "ethers";

async function getAccountBalance(account: Signer) {
  return ethers.utils.formatEther(await account.getBalance());
}

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
    `Deploying contracts with the following account address: ${deployer.address}`
  );
  console.log(
    `Deployer Account Balance: ${await getAccountBalance(deployer)} ETH`
  );

  const token = await ethers.deployContract("RealEstateFungibleToken");

  console.log(`Token deployed to address: ${token.address}`);
  console.log(
    `Deployer Account Balance: ${await getAccountBalance(deployer)} ETH`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
