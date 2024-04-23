"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";
import UserDropdown from "./UserDropdown";
import { useSession } from "next-auth/react";
import CTA from "./CTA";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function Nav() {
  const { data: session, status } = useSession();

  // Check if session data is still being fetched
  if (status === "loading") {
    return (
      <Navbar fluid rounded>
        <NavbarBrand href="/">
          <img src="/images/Dunno.jpg" className="mr-3 h-6 sm:h-9" alt="LOGO" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            REFT
          </span>
        </NavbarBrand>
        <div className="flex md:order-2">
          <NavbarToggle />
        </div>
        <NavbarCollapse className="flex-grow justify-center ml-32">
          <NavbarLink href="/property/search">View Properties</NavbarLink>
        </NavbarCollapse>
      </Navbar>
    );
  }

  return (
    <Navbar fluid rounded>
      <NavbarBrand href="/">
        <img src="/images/Dunno.jpg" className="mr-3 h-6 sm:h-9" alt="LOGO" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          REFT
        </span>
      </NavbarBrand>
      <div className="flex md:order-2">
        {session && (
          <div className="mr-20">
            <ConnectButton />
          </div>
        )}
        {session ? (
          <div>
            <UserDropdown />
          </div>
        ) : (
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <div className="flex py-2 px-3 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500">
              <Link href="/auth/signin">Sign in</Link>
            </div>
            <div className="ml-4">
              <CTA href="/auth/signup" text="Signup" />
            </div>
          </div>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse className="flex-grow justify-center ml-32">
        <NavbarLink href="/property/search">View Properties</NavbarLink>
        {session && (
          <NavbarLink href="/property/tokenize">Tokenize Property</NavbarLink>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}

export default Nav;
