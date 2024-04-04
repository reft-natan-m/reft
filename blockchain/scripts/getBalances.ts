import { ethers } from "hardhat";
import { logAccountBalances } from "./utils";

async function main() {
  const signers = await ethers.getSigners();

  await logAccountBalances(signers);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
