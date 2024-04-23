"use client";

import { Sidebar } from "flowbite-react";
import {
  HiOfficeBuilding,
  HiShieldExclamation,
  HiCurrencyDollar,
  HiIdentification,
  HiBookOpen,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { useSession } from "next-auth/react";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";

function UserSidebar() {
  const { data: session } = useSession();
  const userSession = session?.user as UserSession;
  return (
    <Sidebar aria-label="User Sidebar" className="justify-start h-80">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href={`/user/${userSession?.username}/settings/email`}
            icon={HiShieldExclamation}
          >
            Change Email
          </Sidebar.Item>
          <Sidebar.Item
            href={`/user/${userSession?.id}/settings/password`}
            icon={HiViewBoards}
          >
            Change Password
          </Sidebar.Item>
          <Sidebar.Item
            href={`/user/${userSession?.id}/settings/username`}
            icon={HiUser}
          >
            Change Username
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href={`/user/${userSession?.id}/properties`}
            icon={HiOfficeBuilding}
          >
            Properties
          </Sidebar.Item>
          <Sidebar.Item href="/property/tokenize" icon={HiCurrencyDollar}>
            Tokenize
          </Sidebar.Item>
          {/* <Sidebar.Item href="#" icon={HiBookOpen}>
          History
          </Sidebar.Item> */}
          {/* <Sidebar.Item href="#" icon={HiIdentification}>
            Wallet
          </Sidebar.Item> */}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default UserSidebar;
