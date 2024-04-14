"use client";

import { useSession } from "next-auth/react";
import CardCarousel from "./ui/CardCarousel";
import SearchBar from "./ui/SearchBar";
import { Button } from "flowbite-react";
import { useAccount } from 'wagmi';
import { BrowserProvider, JsonRpcSigner, Contract, parseEther } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import { type Config, useConnectorClient } from 'wagmi'

// Load the JSON file containing ABI and other data
import RealEstateFungibleTokenData from '../../blockchain/artifacts/contracts/RealEstateFungibleToken.sol/RealEstateFungibleToken.json';

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}

const Home = () => {
  const { address } = useAccount();
  const signer = useEthersSigner();
  // const { data: session, status } = useSession();
  // console.log(session);
  // console.log(status);

  function sendTransaction() {
  
    const handleSendTransaction = async () => {
      if (!address) {
        alert('Please connect your wallet first.');
        return;
      }
      // Extract the ABI from the loaded JSON data
      const abi = RealEstateFungibleTokenData.abi;
      const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const reft = new Contract(tokenAddress, abi, signer);
      try {
        const result = await reft.balanceOf(signer?.address, 1);
        console.log(result);
        const propertyId = 1;
        const propertyValueInEthereum = 1;
        const propertyValueInWei = parseEther(propertyValueInEthereum.toString());
        const tokensToMint = 100;
        const uri = "www.example.com/api/property/1";
        const mintResult = await reft.mint(signer?.address,
          propertyId,
          tokensToMint,
          propertyValueInWei,
          uri)
        
        console.log(mintResult);
        const saleResult = await reft.buyTokens(1, {
          value: propertyValueInWei
        });
        console.log(saleResult);
        
        const result2 = await reft.balanceOf(signer?.address, 1);
        console.log(result2);

      } catch (error) {
        console.error('Error calling contract function:', error);
      }
      

      // const reft = await ethers.getContractAt("RealEstateFungibleToken", tokenAddress);


      // if (signer) {
        
      // }

  
      // // Send the address and transaction details to your backend
      // const response = await axios.post('/api/transaction', {
      //   fromAddress: address,
      //   // Include other transaction details as necessary
      // });
  
      // console.log(response.data);
    };

    handleSendTransaction();
    };

  return (
    <div>
      <SearchBar />
      <h3 className="text-xl font-semibold sm:text-center text-gray-900 dark:text-white sm:mb-6 sm:text-2xl">
        Real Estate Near You.
      </h3>
      <Button onClick={function () { sendTransaction(); }}> Im a button </Button>
      <CardCarousel />
    </div>
  );
}

export default Home;
