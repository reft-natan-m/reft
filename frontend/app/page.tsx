"use client";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session, status } = useSession();
  console.log(session);
  return (
    <div>
      <h1>Hello REFT Bois</h1>
    </div>
  );
};

export default Home;
