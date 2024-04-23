"use client";

import React, { useEffect, useState } from "react";
import { Card, List } from "flowbite-react";
import { Property, Token } from "@prisma/client";
import { UserSession } from "../api/auth/[...nextauth]/route";

interface PropertyCardProps {
  data: Property;
  updatePropertyData?: () => void;
  user?: boolean;
  userSession: UserSession;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const capitalizeWords = (s: string) => {
  return s.replace(/\b\w/g, (char) => char.toUpperCase());
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  data,
  updatePropertyData,
  userSession,
}) => {
  const [imageSrc, setImageSrc] = useState(`/images/${data.id}/Image0.jpg`);
  const [listedTokensCount, setListedTokensCount] = useState(0);
  const [unlistedTokensCount, setUnlistedTokensCount] = useState(0);
  const [userHasTokensListed, setUserHasTokensListed] = useState(false);
  const [userHasTokens, setUserHasTokens] = useState(false);

  const handleImageError = () => {
    // If primary image fails to load, switch to fallback image
    setImageSrc("/images/Dunno.jpg");
  };

  const [ETH, setETH] = useState<number | null>(null);

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
        const hasTokens = unlistedTokens > 0;
        setUserHasTokens(hasTokens);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error, show error message, etc.
      }
    };
    if (userSession) {
      fetchData();
    }
  }, [data.id]);

  return (
    <div className="w-auto 2xl:w-96 h-full flex">
      <Card
        imgSrc={imageSrc}
        imgAlt="Main image"
        onError={handleImageError}
        className="flex-grow"
      >
        <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {formatter.format(data.value)}
        </h5>
        {userHasTokens ? (
          <div>
            <div className="flex justify-between mb-4">
              <List horizontal>
                <List.Item className="text-center">
                  Listed Tokens: {data.tokensforSale}
                </List.Item>
                <span>|</span>
                <List.Item className="text-center">
                  Your Listed: {listedTokensCount}
                </List.Item>
              </List>
            </div>
            <div className="flex justify-between">
              <List horizontal>
                <List.Item className="text-center">
                  Total Tokens: {data.tokensMinted}
                </List.Item>
                <span>|</span>
                <List.Item className="text-center">
                  Owned Tokens: {unlistedTokensCount + listedTokensCount}
                </List.Item>
              </List>
            </div>
          </div>
        ) : (
          <List horizontal>
            <List.Item className="text-center">
              Listed Tokens: {data.tokensforSale}
            </List.Item>
            <span>|</span>
            <List.Item className="text-center">
              Total Tokens: {data.tokensMinted}
            </List.Item>
          </List>
        )}

        <List horizontal>
          <List.Item className="text-center">
            Token Price: {formatter.format(data.value / data.tokensMinted)} /{" "}
            {ETH !== null ? ETH.toFixed(2) : "Loading..."} ETH
          </List.Item>
        </List>
        <p className="text-center font-normal text-gray-700 dark:text-gray-400">
          {capitalizeWords(data.street1)} {capitalizeWords(data.street2)},{" "}
          {capitalizeWords(data.city)}, {data.state}, {data.zip}
        </p>
      </Card>
    </div>
  );
};

export default PropertyCard;
