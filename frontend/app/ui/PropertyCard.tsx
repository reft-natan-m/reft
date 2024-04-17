"use client";

import React from "react";
import { Card, List } from "flowbite-react";
import Image from "next/image";
import { PropertyData } from "./CardData";
import { Property } from "@prisma/client";

interface PropertyCardProps {
  data: Property;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PropertyCard: React.FC<PropertyCardProps> = ({ data }) => {
  //console.log(data);
  return (
    <div className="w-auto 2xl:w-96">
      <Card imgAlt="Main Property Image" imgSrc="/images/Dunno.jpg">
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
