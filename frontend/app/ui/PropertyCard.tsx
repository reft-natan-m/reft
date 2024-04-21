"use client";

import React, { useEffect, useState } from "react";
import { Card, List } from "flowbite-react";
import { Property } from "@prisma/client";

interface PropertyCardProps {
  data: Property;
  updatePropertyData?: () => void;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PropertyCard: React.FC<PropertyCardProps> = ({
  data,
  updatePropertyData,
}) => {
  const [imageSrc, setImageSrc] = useState(`/images/${data.id}/Image0.jpg`);

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

  return (
    <div className="w-auto 2xl:w-96">
      <Card imgSrc={imageSrc} imgAlt="Main image" onError={handleImageError}>
        <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {formatter.format(data.value)}
        </h5>
        <List horizontal>
          <List.Item className="text-center">
            Listed Tokens: {data.tokensforSale}
          </List.Item>
          <span>|</span>
          <List.Item className="text-center">
            Total Tokens: {data.tokensMinted}
          </List.Item>
        </List>
        <List horizontal>
          <List.Item className="text-center">
            Token Price: {formatter.format(data.value / data.tokensMinted)} /{" "}
            {ETH !== null ? ETH.toFixed(2) : "Loading..."} ETH
          </List.Item>
        </List>
        <p className="text-center font-normal text-gray-700 dark:text-gray-400">
          {data.street1}, {data.city}, {data.state}, {data.zip}
        </p>
      </Card>
    </div>
  );
};

export default PropertyCard;
