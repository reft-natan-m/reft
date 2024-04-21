"use client";

import { useSession } from "next-auth/react";
import { UserSession } from "./api/auth/[...nextauth]/route";
import CardCarousel from "./ui/CardCarousel";
import Feature from "./ui/Features";
import SearchBar from "./ui/SearchBar";
import { FooterComp } from "./ui/Footer";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const { data: session } = useSession();
  const userSession = session?.user as UserSession;
  //console.log(userSession.id);
  // console.log(status);

  const router = useRouter();

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
