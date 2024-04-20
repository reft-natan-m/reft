import React from "react";
import { Button } from "flowbite-react";
import { useEthersSigner } from "../../app/api/transactions"
import { Contract, parseEther } from 'ethers'
import RealEstateFungibleTokenData from '../../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json';
import { useAccount, useBalance } from 'wagmi';

// Extract the ABI from the loaded JSON data
const abi = RealEstateFungibleTokenData.abi; 

const Buy = ({ contractAddress, propertyId, tokensToBuy }: {
  contractAddress: string,
  propertyId: number,
  tokensToBuy: number,
}) => {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const balance = useBalance({address: address});

  // BUY FUNCTION
  const buyTokens = async () => {
    const ethBalance = balance.data?.value;
    if (!address || !ethBalance || !signer) {
      alert('Please connect your wallet first.');
      return;
    }
    if (tokensToBuy < 1) {
      alert('Tokens to be bougth cannot be zero or negatve.')
      return;
    }
    
    // Create Contract
    const reft = new Contract(contractAddress, abi, signer);
    const fee = await reft.getFee(propertyId);
    const pricePerTokenInWei = await reft.getPricePerTokenInWei(propertyId);

    // Calculate Total Wei
    const totalWei = pricePerTokenInWei * BigInt(tokensToBuy) + fee;

    // Check Signer Funds
    if (totalWei > ethBalance) {
      alert('Insufficient Funds, please add funds to your wallet');
      return;
    }
    try {
      const balanceBefore = await reft.balanceOf(signer.address, propertyId);
      console.log('Balance before buying:', balanceBefore.toString());
      const saleResult = await reft.buyTokens(propertyId, tokensToBuy, {
        value: totalWei
      });
      console.log('Buy tokens transaction hash:', saleResult.hash);
      const balanceAfter = await reft.balanceOf(signer.address, propertyId);
      
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
