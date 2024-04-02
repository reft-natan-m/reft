import { ethers } from "hardhat";

async function main() {
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [deployer, second, third, fourth, fifth] = await ethers.getSigners();
  const realEstateFungibleTokenContract = await ethers.getContractFactory(
    "RealEstateFungibleToken"
  );
  const reft = await realEstateFungibleTokenContract.attach(tokenAddress);

  const propertyId = 1;
  const propertyValue = ethers.utils.parseEther("0.00000000001");
  const tokensToMint = 100;
  const uri = "www.example.com";

  await reft.mint(second.address, propertyId, tokensToMint, propertyValue, uri);

  const saleId = 1;
  const amountOfTokensToSell = 1;

  const secondSignerReftInstance = reft.connect(second);
  await secondSignerReftInstance.listTokenForSale(
    saleId,
    propertyId,
    amountOfTokensToSell
  );

  const thirdSingerReftInstance = reft.connect(third);
  await thirdSingerReftInstance.buyTokens(saleId, { value: propertyValue });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
