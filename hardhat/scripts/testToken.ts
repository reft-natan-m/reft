import { ethers } from "hardhat";

async function main() {
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [deployer, second, third, fourth, fifth] = await ethers.getSigners();
  const realEstateFungibleTokenContract = await ethers.getContractFactory(
    "RealEstateFungibleToken"
  );
  const reft = await realEstateFungibleTokenContract.attach(tokenAddress);

  const propertyId = 1;
  const propertyValueInEthereum = 1;
  const propertyValueInWei = ethers.utils.parseEther(
    propertyValueInEthereum.toString()
  );
  const tokensToMint = 100;
  const uri = "www.example.com";

  await reft.mint(
    second.address,
    propertyId,
    tokensToMint,
    propertyValueInWei,
    uri
  );

  const saleId = 1;
  const amountOfTokensToSell = 1;

  const secondSignerReftInstance = reft.connect(second);
  await secondSignerReftInstance.listTokenForSale(
    saleId,
    propertyId,
    amountOfTokensToSell
  );

  const thirdSingerReftInstance = reft.connect(third);
  console.log(await third.getBalance());
  await thirdSingerReftInstance.buyTokens(saleId, {
    value: propertyValueInWei,
  });
  console.log(await third.getBalance());

  const otherSaleId = 2;
  await secondSignerReftInstance.listTokenForSale(
    otherSaleId,
    propertyId,
    amountOfTokensToSell
  );

  console.log(await second.getBalance());
  console.log(await deployer.getBalance());
  console.log(await reft.balanceOf(second.address, propertyId));

  console.log(await secondSignerReftInstance.delistTokenForSale(otherSaleId));

  console.log(await second.getBalance());
  console.log(await deployer.getBalance());
  console.log(await reft.balanceOf(second.address, propertyId));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
