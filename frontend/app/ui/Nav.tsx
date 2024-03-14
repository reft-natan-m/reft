"use client";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { useState } from "react";

const Nav = () => {
  // Will be used to show when a user is logged in (in a session)
  // functionality not complete yet so not implemented

  //const session = await getServerSession(options);

  // all of this is temporary until Nate finishes user CRUD
  // Its just to simulate switching views between a user / non user
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <header className="font-bold bg-nav text-default-text">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <div className="flex justify-start gap-10">
          <div>The REFT Bois</div>
          <Link href="/">Home</Link>
          <Link href="/Tokenize">Tokenize</Link>
        </div>
        <div className="text-decoration-line: underline flex gap-10">
          {isLoggedIn ? (
            <Link href="/" onClick={handleLogout}>
              Logout
            </Link>
          ) : (
            <div className="flex gap-10">
              <Link href="/" onClick={handleLogin}>
                Login
              </Link>
              <Link href="/Register">Sign up</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Nav;
