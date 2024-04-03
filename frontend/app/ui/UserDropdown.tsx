import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const UserDropdown: React.FC = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null); // Change any to your user type
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`/api/register?email=${session?.user?.email}`);
        if (!res.ok) {
          throw new Error("Failed to fetch user info");
        }
        const userData = await res.json();
        setUserInfo(userData);
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    };

    if (session?.user?.email) {
      fetchUserInfo();
    }
  }, [session]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="relative inline-block">
      <img
        id="avatarButton"
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 ring-gray-300 dark:ring-gray-500"
        src={
          userInfo?.avatar ??
          "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        }
        alt="User dropdown"
      />

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute z-10 right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>{userInfo?.name}</div>
            <div className="font-medium truncate">{session?.user?.email}</div>
          </div>
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="avatarButton"
          >
            <li>
              <Link
                href="#"
                onClick={closeDropdown}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Token Management
              </Link>
            </li>
            <li>
              <Link
                href="/wallet"
                onClick={closeDropdown}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Wallet
              </Link>
            </li>
            <li>
              <Link
                href="/user/0/settings"
                onClick={closeDropdown}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Settings
              </Link>
            </li>
          </ul>
          <div className="py-1">
            <Link
              href="/auth/signout"
              onClick={closeDropdown}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
            >
              Sign out
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
