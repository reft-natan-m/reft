"use client";
import PaginationComp from "@/app/ui/Pagination";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEventHandler } from "react";

interface SearchBarProps {
  per_Page: number;
  totalProperties: number;
}

const SearchNav: React.FC<SearchBarProps> = ({ per_Page, totalProperties }) => {
  const router = useRouter();
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    router.refresh();
    router.push("/property/search");
  };

  return (
    <div className="flex justify-between items-center fixed bottom-0 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 px-4">
      {/* Left */}
      <form onSubmit={handleSubmit} className="flex items-center">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Search Bar
        </label>
        <div className="relative w-96">
          <input
            type="search"
            id="search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Address, Neighborhood, City, ZIP"
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </form>

      {/* Center */}
      <div className="flex-grow flex justify-center">
        <PaginationComp totalPages={Math.ceil(totalProperties / per_Page)} />
      </div>

      {/* Right */}
      <div>
        <p>{totalProperties} search results</p>
      </div>
    </div>
  );
};

export default SearchNav;
