"use client";

import React, { useState, useEffect } from "react";
import { Carousel } from "flowbite-react";
import PropertyCard from "./PropertyCard";
import ModalComp from "./ModalComp";
import PropertyDetail from "@/app/ui/PropertyDetail";
import { UserSession } from "../api/auth/[...nextauth]/route";
import { useRouter } from "next/navigation";

interface CardCarouselProps {
  userSession: UserSession;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ userSession }) => {
  const [propertyData, setPropertyData] = useState<any[]>([]);
  const [openModals, setOpenModals] = useState<boolean[][]>([]);

  // Carousel views properties in groups of three
  const MAX: number = 12;

  useEffect(() => {
    fetchPropertyData();
  }, []);

  const fetchPropertyData = () => {
    fetch("/api/property/list")
      .then((response) => response.json())
      .then((properties) => {
        const data = properties.slice(0, MAX);
        setPropertyData(data);
        setOpenModals(
          Array(data.length)
            .fill([])
            .map(() => Array(3).fill(false))
        );
      })
      .catch((error) => {
        console.error("Error fetching property data:", error);
      });
  };

  const updatePropertyData = () => {
    fetch("/api/property/list")
      .then((response) => response.json())
      .then((properties) => {
        const newData = properties.slice(0, MAX);
        setPropertyData(newData);
      })
      .catch((error) => {
        console.error("Error fetching updated property data:", error);
      });
  };

  const chunkArray = (arr: any[], size: number) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
      arr.slice(index * size, index * size + size)
    );
  };

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

  const chunkedData = chunkArray(propertyData, 3);

  return (
    <div>
      <h3 className="text-xl font-semibold sm:text-center text-gray-900 dark:text-white sm:text-2xl">
        Real Estate Opportunities For You.
      </h3>
      <div className="w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="w-full max-w-screen-xl h-full">
          {chunkedData && (
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
                        <PropertyCard
                          data={data}
                          updatePropertyData={updatePropertyData}
                          userSession={userSession}
                        />
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
                        <PropertyDetail
                          data={data}
                          updatePropertyData={updatePropertyData}
                          userSession={userSession}
                        />
                      </ModalComp>
                    </div>
                  ))}
                </div>
              ))}
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
