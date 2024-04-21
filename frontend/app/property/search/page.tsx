"use client";
import { useState, useEffect } from "react";
import PropertyCard from "@/app/ui/PropertyCard";
import SearchNav from "@/app/ui/SearchNav";
import ModalComp from "@/app/ui/ModalComp";
import PropertyDetail from "@/app/ui/PropertyDetail";

interface SearchResultProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SearchResult: React.FC<SearchResultProps> = ({ searchParams }) => {
  const modalHeader = "Token Details";
  const page = searchParams["page"] ? Number(searchParams["page"]) : 1;
  const per_page = searchParams["per_page"]
    ? Number(searchParams["per_page"])
    : 15;

  const [propertyData, setPropertyData] = useState<any[]>([]);
  const [openModals, setOpenModals] = useState<boolean[]>([]);

  useEffect(() => {
    fetchPropertyData();
  }, []);

  const fetchPropertyData = () => {
    fetch("/api/property/list")
      .then((response) => response.json())
      .then((properties) => {
        setPropertyData(properties);
        setOpenModals(Array(properties.length).fill(false));
      })
      .catch((error) => {
        console.error("Error fetching property data:", error);
      });
  };

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

  const entries = propertyData.slice(start, end);

  const search = true;

  return (
    <div>
      <SearchNav
        search={search}
        per_Page={per_page}
        totalProperties={propertyData.length}
      />
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
  );
};

export default SearchResult;
