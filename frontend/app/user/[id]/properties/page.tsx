"use client";
import { useState } from "react";
import PropertyCard from "@/app/ui/PropertyCard";
import SearchNav from "@/app/ui/SearchNav";
import ModalComp from "@/app/ui/ModalComp";
import PropertyDetail from "@/app/ui/PropertyDetail";
import UserSidebar from "@/app/ui/UserSidebar";

interface SearchResultProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SearchResult: React.FC<SearchResultProps> = ({ searchParams }) => {
  const modalHeader = "Token Details";
  const page = searchParams["page"] ? Number(searchParams["page"]) : 1;
  const per_page = searchParams["per_page"]
    ? Number(searchParams["per_page"])
    : 15;

  // Generate 90 property objects for testing pagination
  const totalProperties = 90;
  const cardDataArray = Array.from({ length: totalProperties }, (_, index) => ({
    id: index + 1,
    state: "CA",
    city: `Los Angeles ${index + 1}`,
    street1: `${index + 1} Main St`,
    street2: "",
    zip: `9000${index + 1}`,
    year: 1900 + (index + 1),
    value: 500000 + (index + 1) * 10000,
    tokens: 100 + index,
    tokenToList: 10 + index,
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

  const [openModals, setOpenModals] = useState<boolean[]>(
    Array(cardDataArray.length).fill(false)
  );

  const handleOpenModal = (index: number) => {
    const newModals = [...openModals];
    newModals[index] = true;
    setOpenModals(newModals);
  };

  const handleCloseModal = (index: number) => {
    const newModals = [...openModals];
    newModals[index] = false;
    setOpenModals(newModals);
  };

  const start = (page - 1) * per_page;
  const end = start + per_page;

  const entries = cardDataArray.slice(start, end);
  const search = false;

  return (
    <div className="flex">
      <SearchNav
        search={search}
        per_Page={per_page}
        totalProperties={totalProperties}
      />
      <div className="h-96 mt-4">
        <UserSidebar />
      </div>
      <div className="ml-10">
        <div className="flex justify-center mt-4 mb-24">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-screen-xl mx-auto mt-8">
              {entries.map((property, index) => (
                <div key={property.id} className="p-2 overflow-x-hidden">
                  <button onClick={() => handleOpenModal(index)}>
                    <PropertyCard data={property} />
                  </button>
                  <ModalComp
                    openModal={openModals[index]}
                    setOpenModal={() => handleCloseModal(index)}
                    modalHeader={modalHeader}
                    modalSize="3xl"
                  >
                    <PropertyDetail data={property} />
                  </ModalComp>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
