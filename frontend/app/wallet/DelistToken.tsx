import React from "react";
import { Button } from "flowbite-react";
import { useEthersSigner } from "../../app/api/transactions";
import { Contract } from 'ethers';
import RealEstateFungibleTokenData from '../../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json';
import { useAccount } from 'wagmi';

// Extract the ABI from the loaded JSON data
const abi = RealEstateFungibleTokenData.abi; 

const Delist = ({ contractAddressTest, saleId }: {
  contractAddressTest: string,
  saleId: any,
}) => {
  const { address } = useAccount();
  const signer = useEthersSigner();

  // DELIST FUNCTION
  const delistTokens = async () => {
    if (!address) {
      alert('Please connect your wallet first.');
      return;
    }
    const reft = new Contract(contractAddressTest, abi, signer);
    try {
      const delistResult = await reft.delistTokenForSale(saleId);
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
