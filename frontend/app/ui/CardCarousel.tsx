import React from "react";
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

const CardCarousel: React.FC = () => {
  return (
    <div className="px-4 py-16 mx-auto max-w-screen-xl bg-gray-50 dark:bg-gray-500 rounded-full border-8 border-gray-900 dark:border-gray-200">
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <div className="h-96">
            <Carousel
              pauseOnHover
              indicators={false}
              onSlideChange={(index) => console.log("onSlideChange()", index)}
            >
              {cardDataArray.map((data, index) => (
                <div
                  key={data.id}
                  className="flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white"
                >
                  <PropertyCard data={data} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
