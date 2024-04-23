"use client";
import { useState, useEffect } from "react";
import PropertyCard from "@/app/ui/PropertyCard";
import SearchNav from "@/app/ui/SearchNav";
import ModalComp from "@/app/ui/ModalComp";
import PropertyDetail from "@/app/ui/PropertyDetail";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";
import { Spinner } from "flowbite-react";

interface SearchResultProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SearchResult: React.FC<SearchResultProps> = ({ searchParams }) => {
  const { data: session } = useSession();
  const userSession = session?.user as UserSession;

  const sParams = useSearchParams();
  const newParam = sParams.get("city");
  let paramAPI = `/api/property/list`;

  const modalHeader = "Token Details";
  const page = searchParams["page"] ? Number(searchParams["page"]) : 1;
  const per_page = searchParams["per_page"]
    ? Number(searchParams["per_page"])
    : 15;

  const [propertyData, setPropertyData] = useState<any[]>([]);
  const [openModals, setOpenModals] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (newParam) {
      paramAPI = `/api/property/list?city=${newParam}`;
    }
    fetchPropertyData();
  }, [newParam]);

  const fetchPropertyData = () => {
    fetch(paramAPI)
      .then((response) => response.json())
      .then((properties) => {
        setPropertyData(properties);
        setOpenModals(Array(properties.length).fill(false));
      })
      .catch((error) => {
        console.error("Error fetching property data:", error);
      })
      .finally(() => setLoading(false));
    setRefresh(!refresh);
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
  if (loading) {
    return (
      <div>
        <SearchNav
          search={search}
          per_Page={per_page}
          totalProperties={0}
          userSession={userSession}
        />
        <div className="flex justify-center items-center mt-24">
          <div className="w-full items-center text-center">
            <Spinner aria-label="Loading Spinner" size="xl" />
            <h3 className="text-xl font-semibold sm:text-center text-gray-900 dark:text-white sm:text-2xl mt-4">
              Page loading...
            </h3>
          </div>
        </div>
      </div>
    );
  } else if (propertyData.length <= 0) {
    return (
      <div>
        <SearchNav
          search={search}
          per_Page={per_page}
          totalProperties={0}
          userSession={userSession}
        />
        <div className="flex justify-center mt-4 mb-24">
          <div className="w-full">
            <h3 className="text-xl font-semibold sm:text-center text-gray-900 dark:text-white sm:text-2xl">
              No properties found based on search parameters, please try a
              different query.
            </h3>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <SearchNav
          search={search}
          per_Page={per_page}
          totalProperties={propertyData.length}
          userSession={userSession}
        />
        <div className="flex justify-center mt-4 mb-24">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-screen-xl mx-auto mt-8">
              {entries.map((property, index) => (
                <div key={property.id} className="p-2 overflow-x-hidden h-full">
                  <button onClick={() => handleOpenModal(index)}>
                    <PropertyCard data={property} userSession={userSession} />
                  </button>
                  <ModalComp
                    openModal={openModals[index]}
                    setOpenModal={() => handleCloseModal(index)}
                    modalHeader={modalHeader}
                    modalSize="3xl"
                  >
                    <PropertyDetail data={property} userSession={userSession} />
                  </ModalComp>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default SearchResult;
