"use client";

import { useSession } from "next-auth/react";
import { UserSession } from "./api/auth/[...nextauth]/route";
import CardCarousel from "./ui/CardCarousel";
import Feature from "./ui/Features";
import SearchBar from "./ui/SearchBar";
import { FooterComp } from "./ui/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Mint from "./wallet/Mint";

const Home = () => {
  const { data: session } = useSession();
  const userSession = session?.user as UserSession;
  //console.log(userSession.id);
  // console.log(status);

  const router = useRouter();
  // process.env.TOKEN_ADDRESS;

  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <div>
      <SearchBar />
      <CardCarousel userSession={userSession} />

      <div className="bg-gray-100 dark:bg-secondary">
        <Feature userSession={userSession} />
      </div>
      <FooterComp />
    </div>
  );
};

export default Home;
