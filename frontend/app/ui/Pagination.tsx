"use client";
import React from "react";
import { Pagination } from "flowbite-react";
import { useRouter } from "next/navigation";
import { UserSession } from "../api/auth/[...nextauth]/route";

interface PaginationCompProps {
  totalPages: number;
  search: boolean;
  userSession: UserSession;
}

const PaginationComp: React.FC<PaginationCompProps> = ({
  totalPages,
  search,
  userSession,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (search) {
      router.push(`/property/search?page=${Number(page)}`);
    } else {
      router.push(`/user/${userSession?.id}/properties?page=${Number(page)}`);
    }
    console.log("Page changed to:", page);
  };

  return (
    <div className="flex justify-center mb-2">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PaginationComp;
