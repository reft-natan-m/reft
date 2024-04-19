"use client";

import React, { useEffect, useState } from "react";
import { Card, List } from "flowbite-react";
import Image from "next/image";
import { Property } from "@prisma/client";

interface PropertyCardProps {
  data: Property;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PropertyCard: React.FC<PropertyCardProps> = ({ data }) => {
  const [imageSrc, setImageSrc] = useState(`/images/${data.id}/Image0.jpg`);

  const handleImageError = () => {
    // If primary image fails to load, switch to fallback image
    setImageSrc("/images/Dunno.jpg");
  };

  return (
    <div className="w-auto 2xl:w-96">
      <Card imgSrc={imageSrc} imgAlt="Main image" onError={handleImageError}>
        <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {formatter.format(data.value)}
        </h5>
        <List horizontal>
          <List.Item className="text-center">
            Token(s) For Sale: {data.tokensforSale}
          </List.Item>
          <span>|</span>
          <List.Item className="text-center">
            Total Tokens: {data.tokensMinted}
          </List.Item>
          <List.Item className="text-center">
            Token Price: {formatter.format(data.value / data.tokensMinted)}
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
