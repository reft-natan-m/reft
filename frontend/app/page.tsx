"use client";

import { useSession } from "next-auth/react";
import CardCarousel from "./ui/CardCarousel";
import SearchBar from "./ui/SearchBar";
import Mint from "./wallet/Mint";
import Buy from "./wallet/BuyToken";
import List from "./wallet/ListToken";
import Delist from "./wallet/DelistToken";

//TEST DATA SCENEARIO
const contractAddressTest = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const uri = "www.example.com/api/property/1";
const propertyId = 2;
const propertyValueInEthereum = 1;
const tokensToMint = 100;
const tokensToBuy = 100;
const saleId = 1;
const tokens = 10;

const Home = () => {
  return (
    <div>
      <SearchBar />
      <h3 className="text-xl font-semibold sm:text-center text-gray-900 dark:text-white sm:mb-6 sm:text-2xl">
        Real Estate Near You.
      </h3>
      {/* <Mint
        contractAddressTest={contractAddressTest}
        propertyId={propertyId}
        propertyValueInEthereum={propertyValueInEthereum}
        tokensToMint={tokensToMint}
        uri={uri}
      />
      <Buy
        contractAddressTest={contractAddressTest}
        propertyId={propertyId}
        propertyValueInEthereum={propertyValueInEthereum}
        tokensToBuy={tokensToBuy}
      />
      <List
        contractAddressTest={contractAddressTest}
        saleId={saleId}
        propertyId={propertyId}
        tokens={tokens}
      />
      <Delist
        contractAddressTest={contractAddressTest}
        saleId={saleId}
      /> */}
      <CardCarousel />
    </div>
  );
}

export default Home;
