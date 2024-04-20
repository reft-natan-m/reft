import React from "react";
import { Button } from "flowbite-react";
import { useEthersSigner } from "../../app/api/transactions"
import { Contract } from 'ethers'
import RealEstateFungibleTokenData from '../../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json';
import { useAccount, useBalance } from 'wagmi';

// Extract the ABI from the loaded JSON data
const abi = RealEstateFungibleTokenData.abi; 

const List = ({ contractAddress, propertyId, tokens}: {
  contractAddress: string,
  propertyId: number,
  tokens: number,
}) => {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const balance = useBalance({address: address});

  // LIST FUNCTION
  const listTokens = async () => {
    const ethBalance = balance.data?.value;
    if (!address || !ethBalance || !signer) {
      alert('Please connect your wallet first.');
      return;
    } 
    if (tokens < 1) {
      alert('Tokens to be listed cannot be zero or negatve.')
      return;
    }

    const reft = new Contract(contractAddress, abi, signer);
    const feeWei = await reft.getFee(propertyId);

    // Check Signer Funds
    if (feeWei > ethBalance) {
      alert('Insufficient Funds, please add funds to your wallet');
      return;
    }
    try {
      const listResult = await reft.listTokenForSale(propertyId, tokens, {
        value: feeWei
      })
      console.log('List tokens result:', listResult);
      
      alert('Tokens listed for sale successfully!');

      const balance = await reft.balanceOf(signer.address, propertyId);
      console.log('Balance after listing tokens:', balance.toString());
    } catch (error) {
      console.error('Error listing tokens:', error);
      alert('Error listing tokens. Please try again.');
    }
  };

  return (
    <Button onClick={listTokens}> List Button </Button>
  );
};

export default List;
