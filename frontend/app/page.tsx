"use client";

import { useSession } from "next-auth/react";
import CardCarousel from "./ui/CardCarousel";
import Feature from "./ui/Features";
import { UserSession } from "./api/auth/[...nextauth]/route";
import SearchBar from "./ui/SearchBar";
import { FooterComp } from "./ui/Footer";

const Home = () => {
  const { data: session, status } = useSession();
  const userSession = session?.user as UserSession;
  //console.log(userSession.id);
  // console.log(status);

  return (
    <div>
      <SearchBar />
      <CardCarousel />
      <div className="bg-gray-100 dark:bg-secondary">
        <Feature userSession={userSession} />
      </div>
      <FooterComp />
    </div>
  );
};

export default Home;
