import { ethers } from "hardhat";
import { getAccountBalance, logAccountBalances } from "./utils";

async function main() {
  /***************************************************
   * ! INITIALIZE CONTRACT
   ***************************************************/
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [deployer, second, third, fourth, fifth] = await ethers.getSigners();

  const allSigners = [deployer, second, third, fourth, fifth];

  await logAccountBalances(allSigners);

  // this uses the deployer as the signer by default to pay for gas, this is just how hardhat works,
  // if you don't specify a signer it will use the deployer, this is not how ethers.js works
  const reft = await ethers.getContractAt("RealEstateFungibleToken", tokenAddress);

  /***************************************************
   * ! MINT TOKENS
   ***************************************************/
  const propertyId = 1;
  const propertyValueInEthereum = 1;
  const propertyValueInWei = ethers.parseEther(propertyValueInEthereum.toString());
  const tokensToMint = 100;
  const feePercentage = 0.0001;
  const totalPropertyCost = propertyValueInEthereum * tokensToMint;
  const fee = totalPropertyCost * feePercentage;
  const feeInWei = ethers.parseEther(fee.toString());
  const uri = "www.example.com/api/property/1";

  console.log(`Minting ${tokensToMint} tokens for property ${propertyId} to ${second.address}`);
  console.log(`Signer #2 Balance ${await getAccountBalance(second)} ETH`);
  console.log(
    `Signer #2 Property #${propertyId} Tokens:  ${await reft.balanceOf(second.address, propertyId)}`
  );

  // connect the second signer to the contract to execute contract functions as the second signer
  const secondSignerReftInstance = reft.connect(second);
  await secondSignerReftInstance.mint(
    second.address,
    propertyId,
    tokensToMint,
    propertyValueInWei,
    uri
  );

  console.log(`Property #${propertyId} Minted`);

  console.log(`Signer #2 Balance ${await getAccountBalance(second)} ETH`);
  console.log(
    `Signer #2 Property #${propertyId} Tokens:  ${await reft.balanceOf(second.address, propertyId)}`
  );

  /***************************************************
   * ! LISTING TOKENS
   ***************************************************/
  const saleId = 1;
  const amountOfTokensToSell = 1;

  console.log(
    `Signer #2 is listing ${amountOfTokensToSell} tokens of Property #${propertyId} for sale`
  );
  console.log(`Signer #2 Balance ${await getAccountBalance(second)} ETH`);
  console.log(
    `Contract Property #${propertyId} Tokens:  ${await reft.balanceOf(tokenAddress, propertyId)}`
  );
  console.log(
    `Signer #2 Property #${propertyId} Tokens:  ${await reft.balanceOf(second.address, propertyId)}`
  );

  await secondSignerReftInstance.listTokenForSale(saleId, propertyId, amountOfTokensToSell, {
    value: feeInWei,
  });

  console.log(`Sale #${saleId} Listed`);

  console.log(`Signer #2 Balance ${await getAccountBalance(second)} ETH`);
  console.log(
    `Contract Property #${propertyId} Tokens:  ${await reft.balanceOf(tokenAddress, propertyId)}`
  );
  console.log(
    `Signer #2 Property #${propertyId} Tokens:  ${await reft.balanceOf(second.address, propertyId)}`
  );

  /***************************************************
   * ! BUYING TOKENS
   ***************************************************/
  const thirdSingerReftInstance = reft.connect(third);
  console.log(
    `Signer #3 is buying ${amountOfTokensToSell} tokens of Property #${propertyId} for ${propertyValueInEthereum} ETH`
  );
  console.log(`Signer #2 Balance ${await getAccountBalance(second)} ETH`);
  console.log(`Signer #3 Balance ${await getAccountBalance(third)} ETH`);
  console.log(
    `Contract Property #${propertyId} Tokens:  ${await reft.balanceOf(tokenAddress, propertyId)}`
  );
  console.log(
    `Signer #2 Property #${propertyId} Tokens:  ${await reft.balanceOf(second.address, propertyId)}`
  );
  console.log(
    `Signer #3 Property #${propertyId} Tokens:  ${await reft.balanceOf(third.address, propertyId)}`
  );

  await thirdSingerReftInstance.buyTokens(saleId, {
    value: propertyValueInWei + feeInWei,
  });

  console.log(`Signer #3 bought ${amountOfTokensToSell} tokens`);

  console.log(`Signer #2 Balance ${await getAccountBalance(second)} ETH`);
  console.log(`Signer #3 Balance ${await getAccountBalance(third)} ETH`);
  console.log(
    `Contract Property #${propertyId} Tokens:  ${await reft.balanceOf(tokenAddress, propertyId)}`
  );
  console.log(
    `Signer #2 Property #${propertyId} Tokens:  ${await reft.balanceOf(second.address, propertyId)}`
  );
  console.log(
    `Signer #3 Property #${propertyId} Tokens:  ${await reft.balanceOf(third.address, propertyId)}`
  );

  /***************************************************
   * ! DELISTING TOKENS
   ***************************************************/
  const otherSaleId = 2;

  console.log(
    `Signer #2 is listing ${amountOfTokensToSell} tokens of Property #${propertyId} for sale`
  );
  console.log(`Signer #2 Balance ${await getAccountBalance(second)} ETH`);
  console.log(
    `Contract Property #${propertyId} Tokens:  ${await reft.balanceOf(tokenAddress, propertyId)}`
  );
  console.log(
    `Signer #2 Property #${propertyId} Tokens:  ${await reft.balanceOf(second.address, propertyId)}`
  );

  await secondSignerReftInstance.listTokenForSale(otherSaleId, propertyId, amountOfTokensToSell, {
    value: feeInWei,
  });

  console.log(`Sale #${otherSaleId} Listed`);

  console.log(`Signer #2 Balance ${await getAccountBalance(second)} ETH`);
  console.log(
    `Contract Property #${propertyId} Tokens:  ${await reft.balanceOf(tokenAddress, propertyId)}`
  );
  console.log(
    `Signer #2 Property #${propertyId} Tokens:  ${await reft.balanceOf(second.address, propertyId)}`
  );

  console.log(
    `Signer #2 is delisting ${amountOfTokensToSell} tokens of Property #${propertyId} for sale`
  );

  console.log(`Signer #2 Balance ${await getAccountBalance(second)} ETH`);
  console.log(
    `Contract Property #${propertyId} Tokens:  ${await reft.balanceOf(tokenAddress, propertyId)}`
  );
  console.log(
    `Signer #2 Property #${propertyId} Tokens:  ${await reft.balanceOf(second.address, propertyId)}`
  );

  await secondSignerReftInstance.delistTokenForSale(otherSaleId);

  console.log(`Sale #${otherSaleId} Delisted`);

  console.log(`Signer #2 Balance ${await getAccountBalance(second)} ETH`);
  console.log(
    `Contract Property #${propertyId} Tokens:  ${await reft.balanceOf(tokenAddress, propertyId)}`
  );
  console.log(
    `Signer #2 Property #${propertyId} Tokens:  ${await reft.balanceOf(second.address, propertyId)}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
