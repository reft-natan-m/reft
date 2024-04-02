import { ethers } from "hardhat";

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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
