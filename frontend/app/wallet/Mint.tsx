import React from "react";
import { Button } from "flowbite-react";
import { useEthersSigner } from "../../app/api/transactions"
import { Contract, parseEther } from 'ethers'
import RealEstateFungibleTokenData from '../../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json';
import { useAccount, useBalance } from 'wagmi';

// Extract the ABI from the loaded JSON data
const abi = RealEstateFungibleTokenData.abi; 

const Mint = ({ contractAddress, propertyId, pricePerTokenInEthereum, tokensToMint, uri }: {
  contractAddress: string,
  propertyId: number,
  pricePerTokenInEthereum: number,
  tokensToMint: number,
  uri: string
}) => {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const balance = useBalance({address: address});
  

  // MINT FUNCTION
  const mintToken = async () => {
    const ethBalance = balance.data?.value;
    if (!address || !ethBalance || !signer) {
      alert('Please connect your wallet first.');
      return;
    }
    if (tokensToMint < 1) {
      alert('Tokens to be minted cannot be zero or negative.')
      return;
    }

    // Create Contract
    const reft = new Contract(contractAddress, abi, signer);

    // Check Signer Funds
    const feeWei = await reft.getFee(propertyId);
    if (feeWei > ethBalance) {
      alert('Insufficient Funds, please add funds to your wallet');
      return;
    }

    try {
      const pricePerTokenInWei = parseEther(pricePerTokenInEthereum.toString());
      const result = await reft.balanceOf(signer.address, propertyId);
      console.log('Current balance:', result.toString());

      const mintResult = await reft.mint(signer.address,
        propertyId,
        tokensToMint,
        pricePerTokenInWei,
        uri)
      
      console.log('Mint transaction hash:', mintResult.hash);
      console.log(`Minting ${tokensToMint} tokens for property ${propertyId} to ${address}`);
      console.log(`Signer Balance ${ethBalance} ETH`);
      console.log(`Signer Property #${propertyId} Tokens: ${await reft.balanceOf(signer.address, propertyId)}`);

      alert('Tokens minted successfully!');
    } catch (error) {
      console.error('Error minting tokens:', error);
      alert('Error minting tokens. Please try again.');
    }
  };

  return (
    <Button onClick={mintToken}> Mint Button </Button>
  );
};

export default Mint;
