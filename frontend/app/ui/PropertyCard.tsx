"use client";

import React from "react";
import { Card, List } from "flowbite-react";
import Image from "next/image";
import { PropertyData } from "./CardData";

interface PropertyCardProps {
  data: PropertyData;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PropertyCard: React.FC<PropertyCardProps> = ({ data }) => {
  //console.log(data);
  return (
    <div className="w-auto 2xl:w-96">
      <Card imgAlt="Main Property Image" imgSrc={data.image}>
        <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {formatter.format(data.value)}
        </h5>
        <List horizontal>
          <List.Item className="text-center">
            Token(s) For Sale: {data.tokenForSale}
          </List.Item>
          <span>|</span>
          <List.Item className="text-center">
            Total Tokens: {data.tokens}
          </List.Item>
          <List.Item className="text-center">
            Token Price: {formatter.format(data.tokenPrice)}
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
