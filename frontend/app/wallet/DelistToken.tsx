import React from "react";
import { Button } from "flowbite-react";
import { useEthersSigner } from "../../app/api/transactions";
import { Contract } from 'ethers';
import RealEstateFungibleTokenData from '../../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json';
import { useAccount, useBalance } from 'wagmi';

// Extract the ABI from the loaded JSON data
const abi = RealEstateFungibleTokenData.abi; 

const Delist = ({ contractAddress, propertyId, amountToDeList }: {
  contractAddress: string,
  propertyId: number,
  amountToDeList: number,
}) => {
  const { address } = useAccount();
  const signer = useEthersSigner();
  const balance = useBalance({address: address});

  // DELIST FUNCTION
  const delistTokens = async () => {
    const ethBalance = balance.data?.value;
    if (!address || !ethBalance || !signer) {
      alert('Please connect your wallet first.');
      return;
    }
    if (amountToDeList < 1) {
      alert('Tokens to be delisted cannot be zero or negative.')
      return;
    }
    
    const reft = new Contract(contractAddress, abi, signer);

    try {
      const delistResult = await reft.delistTokenForSale(propertyId, amountToDeList);
      console.log('Delist tokens result:', delistResult);
      
      alert('Tokens delisted from sale successfully!');
    } catch (error) {
      console.error('Error delisting tokens:', error);
      alert('Error delisting tokens. Please try again.');
    }
  };

  return (
    <Button onClick={delistTokens}> Delist Button </Button>
  );
};

export default Delist;
