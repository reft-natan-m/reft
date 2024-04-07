"use client";

import { useSession } from "next-auth/react";
import CardCarousel from "./ui/CardCarousel";
import SearchBar from "./ui/SearchBar";

const Home = () => {
  const { data: session, status } = useSession();

  console.log(session);
  console.log(status);

  return (
    <div>
      <SearchBar />
      <h3 className="mb-4 text-xl font-semibold sm:text-center text-gray-900 dark:text-white sm:mb-6 sm:text-2xl">
        Real Estate Near You.
      </h3>
      <CardCarousel />
    </div>
  );
};

export default Home;
