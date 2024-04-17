"use client";

import React, { useState } from "react";
import { Carousel } from "flowbite-react";
import PropertyCard from "./PropertyCard";
import ModalComp from "./ModalComp";
import PropertyDetail from "@/app/ui/PropertyDetail";

const cardDataArray = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  state: "CA",
  city: `Los Angeles ${index + 1}`,
  street1: `${index + 1} Main St`,
  street2: "",
  zip: `9000${index + 1}`,
  year: 1900 + (index + 1),
  value: 500000 + (index + 1) * 10000,
  tokens: 100 + index,
  tokenForSale: 10 + index,
  tokenPrice: (500000 + (index + 1) * 10000) / (100 + index),
  propType: "Residential",
  propSubtype: "Single Family",
  size: 1000 + index * 100,
  owners: "Garry",
  ownPercent: "100%",
  entity: "individual",
  income: 100 + index * 100,
  expense: 10 + index * 10,
  image: "/images/Dunno.jpg",
  sizeValue: (500000 + (index + 1) * 10000) / (1000 + index * 100),
}));

const chunkArray = (arr: any[], size: number) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, index * size + size)
  );
};

const CardCarousel: React.FC = () => {
  const chunkedData = chunkArray(cardDataArray, 3);
  const [openModals, setOpenModals] = useState<boolean[][]>(
    Array(chunkedData.length)
      .fill([])
      .map(() => Array(3).fill(false))
  );

  const handleOpenModal = (chunkIndex: number, cardIndex: number) => {
    const newModals = [...openModals];
    newModals[chunkIndex][cardIndex] = true;
    setOpenModals(newModals);
  };

  const handleCloseModal = (chunkIndex: number, cardIndex: number) => {
    const newModals = [...openModals];
    newModals[chunkIndex][cardIndex] = false;
    setOpenModals(newModals);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold sm:text-center text-gray-900 dark:text-white sm:text-2xl">
        Real Estate Near You.
      </h3>
      <div className="w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="w-full max-w-screen-xl h-full">
          <Carousel pauseOnHover indicators={false}>
            {chunkedData.map((chunk, chunkIndex) => (
              <div
                key={chunkIndex}
                className="flex items-center justify-center"
              >
                {chunk.map((data, cardIndex) => (
                  <div
                    key={data.id}
                    className={`mx-10 ${
                      cardIndex !== chunk.length - 1 ? "mr-4" : ""
                    }`}
                  >
                    <button
                      onClick={() => handleOpenModal(chunkIndex, cardIndex)}
                    >
                      <PropertyCard data={data} />
                    </button>
                    <ModalComp
                      key={`modal-${chunkIndex}-${cardIndex}`}
                      openModal={openModals[chunkIndex][cardIndex]}
                      setOpenModal={() =>
                        handleCloseModal(chunkIndex, cardIndex)
                      }
                      modalHeader={"Token Details"}
                      modalSize="3xl"
                    >
                      <PropertyDetail data={data} />
                    </ModalComp>
                  </div>
                ))}
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
