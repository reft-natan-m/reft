"use client";

import { useSession } from "next-auth/react";
import Wallet from "./wallet/page";

const Home = () => {
  const { data: session, status } = useSession();

  console.log(session);
  console.log(status);

  return (
    <div>
      <h1>Hello REFT Bois</h1>
      <Wallet/>
    </div>
  );
};

export default Home;
