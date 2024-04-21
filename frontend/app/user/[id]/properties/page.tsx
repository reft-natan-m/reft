"use client";
import { useState, useEffect } from "react";
import PropertyCard from "@/app/ui/PropertyCard";
import SearchNav from "@/app/ui/SearchNav";
import ModalComp from "@/app/ui/ModalComp";
import PropertyDetail from "@/app/ui/PropertyDetail";
import { useSession } from "next-auth/react";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";

interface UserPropertiesProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const UserProperties: React.FC<UserPropertiesProps> = ({ searchParams }) => {
  const { data: session } = useSession();
  const userSession = session?.user as UserSession;

  const user = true;

  const modalHeader = "Token Details";
  const page = searchParams["page"] ? Number(searchParams["page"]) : 1;
  const per_page = searchParams["per_page"]
    ? Number(searchParams["per_page"])
    : 15;

  const [propertyData, setPropertyData] = useState<any[]>([]);
  const [openModals, setOpenModals] = useState<boolean[]>([]);

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (session) {
      fetchPropertyData();
    }
  }, [session]);

  const fetchPropertyData = () => {
    const userEmail = userSession.email;
    console.log(userEmail);
    fetch(`/api/property/user?email=${userEmail}`)
      .then((response) => response.json())
      .then((properties) => {
        setPropertyData(properties);
        setOpenModals(Array(properties.length).fill(false));
      })
      .catch((error) => {
        console.error("Error fetching property data:", error);
      });
    console.log(propertyData);
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

  const search = false;

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
          {propertyData.length <= 0 && (
            <h3 className="text-xl font-semibold sm:text-center text-gray-900 dark:text-white sm:text-2xl">
              No properties found based on search parameters, please try a
              different query.
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-screen-xl mx-auto mt-8">
            {entries.map((property, index) => (
              <div key={property.id} className="p-2 overflow-x-hidden h-full">
                <button onClick={() => handleOpenModal(index)}>
                  <PropertyCard
                    data={property}
                    user={user}
                    userSession={userSession}
                  />
                </button>
                <ModalComp
                  openModal={openModals[index]}
                  setOpenModal={() => handleCloseModal(index)}
                  modalHeader={modalHeader}
                  modalSize="3xl"
                >
                  <PropertyDetail
                    data={property}
                    userSession={userSession}
                    user={user}
                  />
                </ModalComp>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProperties;
