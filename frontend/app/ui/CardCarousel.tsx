"use client";
import React, { useState } from "react";
import { Carousel } from "flowbite-react";
import PropertyCard from "./PropertyCard";

interface CardData {
  id: number;
  state: string;
  city: string;
  street: string;
  zip: string;
  value: number;
  tokens: number;
  tokenForSale: number;
  tokenPrice: number;
  image: string;
}

const cardDataArray: CardData[] = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  state: "CA",
  city: `Los Angeles ${index + 1}`,
  street: `${index + 1} Main St`,
  zip: `9000${index + 1}`,
  value: 500000 + (index + 1) * 10000,
  tokens: 100 + index,
  tokenForSale: 10 + index,
  tokenPrice: (500000 + (index + 1) * 10000) / (100 + index),
  image: "/images/Dunno.jpg",
}));

const chunkArray = (arr: any[], size: number) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, index * size + size)
  );
};

const CardCarousel: React.FC = () => {
  const chunkedData = chunkArray(cardDataArray, 3); // Split data into chunks of 3

  return (
    <div className="w-full h-screen overflow-hidden flex items-center justify-center">
      <div className="w-full max-w-screen-xl h-full">
        <Carousel
          pauseOnHover
          indicators={false}
          onSlideChange={(index) => console.log("onSlideChange()", index)}
        >
          {chunkedData.map((chunk, index) => (
            <div key={index} className="flex items-center justify-center">
              {chunk.map((data, dataIndex) => (
                <div
                  key={data.id}
                  className={`mx-10 ${
                    dataIndex !== chunk.length - 1 ? "mr-4" : ""
                  }`}
                >
                  <PropertyCard data={data} />
                </div>
              ))}
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default CardCarousel;
