"use client";

import { useSession } from "next-auth/react";
import CardCarousel from "./ui/CardCarousel";
import { Feature } from "./ui/Features";
import SearchBar from "./ui/SearchBar";

const Home = () => {
  // const { data: session, status } = useSession();

  // console.log(session);
  // console.log(status);

  return (
    <div>
      <SearchBar />
      <CardCarousel />
      <div className="bg-gray-100 dark:bg-secondary">
        <Feature />
      </div>
    </div>
  );
};

export default Home;
