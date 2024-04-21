"use client";
import React, { useState, useEffect } from "react";
import GalleryComp from "@/app/ui/GalleryComp";
import BuySellButtons from "./BuySellButtons";
import { Property, Token } from "@prisma/client";
import { UserSession } from "../api/auth/[...nextauth]/route";

interface PropertyDetailProps {
  data: Property;
  updatePropertyData?: () => void;
  userSession: UserSession;
  user?: boolean;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const capitalizeWords = (s: string) => {
  return s.replace(/\b\w/g, (char) => char.toUpperCase());
};

const PropertyDetail: React.FC<PropertyDetailProps> = ({
  data,
  updatePropertyData,
  userSession,
}) => {
  const [ETH, setETH] = useState<number | null>(null);
  const [listedTokensCount, setListedTokensCount] = useState(0);
  const [unlistedTokensCount, setUnlistedTokensCount] = useState(0);
  const [userHasTokensListed, setUserHasTokensListed] = useState(false);
  const [userHasTokens, setUserHasTokens] = useState(false);

  useEffect(() => {
    const fetchETHPriceInUSD = async () => {
      try {
        const response = await fetch(
          "https://api.coinbase.com/v2/prices/ETH-USD/spot"
        );
        const dataETH = await response.json();
        const ethPriceInUSD = parseFloat(dataETH.data.amount);
        const ethAmount = data.value / data.tokensMinted / ethPriceInUSD;
        setETH(ethAmount);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
        setETH(null);
      }
    };

    fetchETHPriceInUSD();
  }, [data, updatePropertyData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user email from session
        const userEmail = userSession.email;

        // Call the API to get user data
        const response = await fetch(`/api/user?email=${userEmail}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        // Parse the JSON response
        const userData = await response.json();

        // Extract tokens from user data
        const tokens = userData.tokens;
        console.log(tokens);
        // Calculate number of tokens listed and unlisted
        let listedTokens = 0;
        let unlistedTokens = 0;
        tokens.forEach((token: Token) => {
          if (token.propertyId === data.id) {
            if (token.listed) {
              listedTokens += token.numberOfTokens;
            } else {
              unlistedTokens += token.numberOfTokens;
            }
          }
        });

        setListedTokensCount(listedTokens);
        setUnlistedTokensCount(unlistedTokens);

        // Check if the user has tokens listed for the property
        const hasTokensListed = listedTokens > 0;
        setUserHasTokensListed(hasTokensListed);

        // Check if the user has any tokens for the property
        const hasTokens = unlistedTokens > 0 || hasTokensListed;
        setUserHasTokens(hasTokens);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error, show error message, etc.
      }
    };

    fetchData();
  }, [data.id]);

  return (
    <div className="flex">
      <ul className="divide-y divide-gray-700 dark:divide-gray-500">
        <li>
          <div className="mb-4">
            <GalleryComp data={data} />
          </div>
        </li>
        <li>
          <div className="mt-4 mb-4">
            <div className="flex justify-between">
              <div className="order-2">
                {userSession && (
                  <BuySellButtons
                    data={data}
                    updatePropertyData={updatePropertyData}
                    ETH={ETH}
                  />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex justify-between">
                  <h5 className="text-start text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {formatter.format(data.value)}
                  </h5>
                </div>
                <h5 className="text-start text-lg font-bold tracking-tight text-gray-600 dark:text-gray-400">
                  {capitalizeWords(data.street1)}{" "}
                  {capitalizeWords(data.street2)}, {capitalizeWords(data.city)},{" "}
                  {data.state}, {data.zip}
                </h5>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div className="flex flex-col mt-4 mb-4">
            <div className="grid grid-cols-3">
              <h5 className="text-start text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {data.tokensforSale}
              </h5>
              <h5 className="text-start text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {data.tokensMinted}
              </h5>
              <h5 className="text-start text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {formatter.format(data.value / data.tokensMinted)} /{" "}
                {ETH !== null ? ETH.toFixed(2) : "Loading..."}
              </h5>
            </div>
            <div className="grid grid-cols-3">
              <h5 className="text-start text-lg font-bold tracking-tight text-gray-600 dark:text-gray-400">
                Listed Tokens
              </h5>
              <h5 className="text-start text-lg font-bold tracking-tight text-gray-600 dark:text-gray-400">
                Total Tokens
              </h5>
              <h5 className="text-start text-lg font-bold tracking-tight text-gray-600 dark:text-gray-400">
                Price Per Token (USD/ETH)
              </h5>
            </div>
          </div>
        </li>
        {userHasTokens && (
          <li>
            <div className="flex flex-col mt-4 mb-4">
              <div className="grid grid-cols-3">
                <h5 className="text-start text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {listedTokensCount}
                </h5>
                <h5 className="text-start text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {unlistedTokensCount + listedTokensCount}
                </h5>
                <h5 className="text-start text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {((unlistedTokensCount + listedTokensCount) /
                    data.tokensMinted) *
                    100}
                  %
                </h5>
              </div>
              <div className="grid grid-cols-3">
                <h5 className="text-start text-lg font-bold tracking-tight text-gray-600 dark:text-gray-400">
                  Your Listed Tokens
                </h5>
                <h5 className="text-start text-lg font-bold tracking-tight text-gray-600 dark:text-gray-400">
                  Owned Tokens
                </h5>
                <h5 className="text-start text-lg font-bold tracking-tight text-gray-600 dark:text-gray-400">
                  Percentage Ownership
                </h5>
              </div>
            </div>
          </li>
        )}
        <li>
          <div className="grid grid-cols-3 mt-4 mb-4 gap-4">
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              {data.propSubtype} {data.propType}
            </div>
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              {data.size} sqft
            </div>
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              {formatter.format(data.value / data.size)}/sqft
            </div>
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              Built in {data.year}
            </div>
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              {formatter.format(data.expense)} Expenses/yr
            </div>
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              {formatter.format(data.income)} Income/yr
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default PropertyDetail;
