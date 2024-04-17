import React from "react";
import { Button } from "flowbite-react";
import { useEthersSigner } from "../../app/api/transactions"
import { Contract, parseEther } from 'ethers'
import RealEstateFungibleTokenData from '../../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json';
import { useAccount } from 'wagmi';

// Extract the ABI from the loaded JSON data
const abi = RealEstateFungibleTokenData.abi; 

const Buy = ({ contractAddressTest, propertyId, propertyValueInEthereum, tokensToBuy }: {
  contractAddressTest: string,
  propertyId: any,
  propertyValueInEthereum: any,
  tokensToBuy: any,
}) => {
  const { address } = useAccount();
  const signer = useEthersSigner();

  // BUY FUNCTION
  const buyTokens = async () => {
    if (!address) {
      alert('Please connect your wallet first.');
      return;
    }
    const reft = new Contract(contractAddressTest, abi, signer);
    try {
      const balanceBefore = await reft.balanceOf(signer?.address, propertyId);
      console.log('Balance before buying:', balanceBefore.toString());

      const propertyValueInWei = parseEther(propertyValueInEthereum.toString());
      const saleResult = await reft.buyTokens(tokensToBuy, {
        value: propertyValueInWei
      });
      console.log('Buy tokens transaction hash:', saleResult.hash);
      const balanceAfter = await reft.balanceOf(signer?.address, propertyId);
      
      console.log('Balance after buying:', balanceAfter.toString());
      alert('Tokens bought successfully!');
    } catch (error) {
      console.error('Error buying tokens:', error);
      alert('Error buying tokens. Please try again.');
    }
  };

  return (
    <Button onClick={buyTokens}> Buy Button </Button>
  );
};

export default Buy;
