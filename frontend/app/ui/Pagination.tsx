"use client";
import React from "react";
import { Pagination } from "flowbite-react";
import { useRouter } from "next/navigation";

interface PaginationCompProps {
  totalPages: number;
}

const PaginationComp: React.FC<PaginationCompProps> = ({ totalPages }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    router.push(`/property/search/?page=${Number(page)}`);

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
