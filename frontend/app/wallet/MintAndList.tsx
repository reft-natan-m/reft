import React from "react";
import { Button } from "flowbite-react";
import { useEthersSigner } from "../api/transactions"
import { Contract, parseEther } from 'ethers'
import RealEstateFungibleTokenData from '../../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json';
import { useAccount, useBalance } from 'wagmi';

// Extract the ABI from the loaded JSON data
const abi = RealEstateFungibleTokenData.abi; 

const MintAndList = ({ contractAddress, propertyId, pricePerTokenInEthereum, tokensToMint, uri, tokens }: {
  contractAddress: string,
  propertyId: number,
  pricePerTokenInEthereum: number,
  tokensToMint: number,
  uri: string,
  tokens: number,
}) => {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const balance = useBalance({address: address});

  // MINT & LIST FUNCTION
  const mintAndList = async () => {
    const ethBalance = balance.data?.value;
    if (!address || !ethBalance || !signer) {
      alert('Please connect your wallet first.');
      return;
    }
    if (tokens < 1 || tokensToMint < 1) {
      alert('Tokens to be minted and listed cannot be zero or negatve.')
      return;
    }
    
    // Create Contract
    const reft = new Contract(contractAddress, abi, signer);

    // Check Signer Funds
    const pricePerTokenInWei = parseEther(pricePerTokenInEthereum.toString());
    const feeWei = pricePerTokenInWei * BigInt(tokensToMint) / BigInt(10000);
    if (feeWei > ethBalance) {
      alert('Insufficient Funds, please add funds to your wallet');
      return;
    }

    try {
      const result = await reft.balanceOf(signer.address, propertyId);
      console.log('Current balance:', result.toString());

      const mintResult = await reft.mintAndListTokenForSale(signer.address,
        propertyId,
        tokensToMint,
        pricePerTokenInWei,
        uri,
        tokens,
        { value: feeWei } // Pass fee as value (in wei) to the transaction
      )
      
      console.log('Mint transaction hash:', mintResult.hash);
      console.log(`Minting ${tokensToMint} tokens for property ${propertyId} to ${address}`);
      console.log('List tokens result:', await reft.getAllListingsForProperty(propertyId));
      alert('Tokens minted and listed successfully!');
    } catch (error) {
      console.error("Error minting and listing tokens:", error);
      alert("Error minting and listing tokens. Please try again.");
    }
  };

  return (
    <Button onClick={mintAndList}> Mint & List Button </Button>
  );
};

export default MintAndList;
