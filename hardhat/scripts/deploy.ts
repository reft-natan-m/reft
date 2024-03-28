import { ethers } from "hardhat";

//? below is from the hardhat tutorial
//? https://hardhat.org/tutorial/deploying-to-a-live-network.html
//? they recommend deploying to a live network testnet called sepolia
async function main() {
  const signers = await ethers.getSigners();

  // get signer addresses and balances
  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i];
    console.log("signer", i + 1, "address:", signer.address);
    console.log(
      "signer",
      i + 1,
      "balance:",
      (await signer.getBalance()).toString()
    );
  }

  const deployer = signers[0];

  console.log("Deploying contracts with the account:", deployer.address);

  const token = await ethers.deployContract("RealEstateFungibleToken");

  console.log("Token address:", await token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// const realEstateFungibleTokenContract = await ethers.getContractFactory(
//   "RealEstateFungibleToken"
// );
// const reft = await realEstateFungibleTokenContract.attach(
//   "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
// );
// await reft.mint(
//   "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
//   1,
//   100,
//   30,
//   "uri"
// );
// await reft.listTokenForSale(1, 1, 10);
await reft.buyTokens(1);
