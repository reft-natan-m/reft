import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const UserDropdown: React.FC = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [avatarURL, setAvatarURL] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/user?email=${session?.user?.email}`);

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await res.json();
        setAvatarURL(userData.avatar);

        setUsername(userData.username);

      } catch (error: any) {
        setErrorMessage(error.message);
      }
    };

    fetchData();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [session]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <img
        id="avatarButton"
        onClick={toggleDropdown}
        className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 ring-gray-300 dark:ring-gray-500"
        src={
          avatarURL ||
          "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        }
        alt="User dropdown"
      />

      {/* Dropdown menu */}
      {dropdownOpen && (
        <div className="absolute z-10 right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div>{username}</div>
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
                href={`/user/${username}/settings/email`}
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
