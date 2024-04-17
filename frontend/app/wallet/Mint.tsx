import React from "react";
import { Button } from "flowbite-react";
import { useEthersSigner } from "../../app/api/transactions"
import { Contract, parseEther } from 'ethers'
import RealEstateFungibleTokenData from '../../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json';
import { useAccount } from 'wagmi';

// Extract the ABI from the loaded JSON data
const abi = RealEstateFungibleTokenData.abi; 

const Mint = ({ contractAddressTest, propertyId, propertyValueInEthereum, tokensToMint, uri }: {
  contractAddressTest: string,
  propertyId: any,
  propertyValueInEthereum: any,
  tokensToMint: any,
  uri: string
}) => {
  const { address } = useAccount();
  const signer = useEthersSigner();

  // MINT FUNCTION
  const mintToken = async () => {
    if (!address) {
      alert('Please connect your wallet first.');
      return;
    }
    const reft = new Contract(contractAddressTest, abi, signer);
    try {
      const propertyValueInWei = parseEther(propertyValueInEthereum.toString());
      const result = await reft.balanceOf(signer?.address, propertyId);
      console.log('Current balance:', result.toString());

      const mintResult = await reft.mint(signer?.address,
        propertyId,
        tokensToMint,
        propertyValueInWei,
        uri)
      
      console.log('Mint transaction hash:', mintResult.hash);
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
