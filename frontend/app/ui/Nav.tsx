"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useState } from "react";
import Link from "next/link";
import Button from "./Button";
import UserDropdown from "./UserDropdown";

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Navbar fluid rounded>
      <NavbarBrand href="/">
        <img src="/images/Dunno.jpg" className="mr-3 h-6 sm:h-9" alt="LOGO" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          REFT
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        {isLoggedIn ? (
          <div>
            <UserDropdown />
          </div>
        ) : (
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <div className="flex py-2 px-3 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500">
              <Link href="/auth/signin" onClick={handleLogin}>
                Sign in
              </Link>
            </div>
            <div className="ml-4">
              <Button href="/auth/signup" text="Signup" />
            </div>
          </div>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="#">Thing 1</NavbarLink>
        <NavbarLink href="#">Thing 2</NavbarLink>
        <NavbarLink href="#">Thing 3</NavbarLink>
        <NavbarLink href="#">Thing 4</NavbarLink>
        <NavbarLink href="#">Thing 5</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Nav;
