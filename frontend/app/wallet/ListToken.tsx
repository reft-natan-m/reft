import React from "react";
import { Button } from "flowbite-react";
import { useEthersSigner } from "../../app/api/transactions"
import { Contract } from 'ethers'
import RealEstateFungibleTokenData from '../../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json';
import { useAccount } from 'wagmi';

// Extract the ABI from the loaded JSON data
const abi = RealEstateFungibleTokenData.abi; 

const List = ({ contractAddressTest, saleId, propertyId, tokens }: {
  contractAddressTest: string,
  saleId: any,
  propertyId: any,
  tokens: any,
}) => {
  const { address } = useAccount();
  const signer = useEthersSigner();

  // LIST FUNCTION
  const listTokens = async () => {
    if (!address) {
      alert('Please connect your wallet first.');
      return;
    }
    const reft = new Contract(contractAddressTest, abi, signer);
    try {
    //Get fee for property
      const listResult = await reft.listTokenForSale(saleId, propertyId, tokens); // 3rd par fee price
      console.log('List tokens result:', listResult);
      
      alert('Tokens listed for sale successfully!');

      const balance = await reft.balanceOf(signer?.address, propertyId);
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
