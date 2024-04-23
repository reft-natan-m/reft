"use client";
import { useState, useEffect } from "react";
import PropertyCard from "@/app/ui/PropertyCard";
import SearchNav from "@/app/ui/SearchNav";
import ModalComp from "@/app/ui/ModalComp";
import PropertyDetail from "@/app/ui/PropertyDetail";
import { useSession } from "next-auth/react";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";
import { Button, Spinner } from "flowbite-react";
import Link from "next/link";
import UserSidebar from "@/app/ui/UserSidebar";

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
  const [loading, setLoading] = useState(true);

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
      })
      .finally(() => setLoading(false));
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

  if (loading) {
    return (
      <div className="flex justify-center mt-4">
        <div className="">
          <UserSidebar />
        </div>
        <SearchNav
          search={search}
          per_Page={per_page}
          totalProperties={0}
          userSession={userSession}
        />
        <div className="flex-1 justify-center items-center mt-24">
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
      <div className="flex justify-center mt-4">
        <div className="">
          <UserSidebar />
        </div>
        <SearchNav
          search={search}
          per_Page={per_page}
          totalProperties={0}
          userSession={userSession}
        />
        <div className="flex-1 justify-center mt-4 mb-24">
          <div className="w-full">
            <h3 className="text-xl font-semibold sm:text-center text-gray-900 dark:text-white sm:text-2xl">
              You do not currently have tokens for any properties...
            </h3>
            <div className="flex justify-center items-center">
              <Link href="/property/search" className="text-center">
                <Button className="mt-10">Start Investing!</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center mt-4">
        <div className="">
          <UserSidebar />
        </div>
        <SearchNav
          search={search}
          per_Page={per_page}
          totalProperties={propertyData.length}
          userSession={userSession}
        />
        <div className="flex-1 justify-center mt-4 mb-24">
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

export default UserProperties;
