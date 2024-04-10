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

function UserSidebar() {
  return (
    <Sidebar aria-label="User Sidebar" className="justify-start">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="/user/[id]/settings/email"
            icon={HiShieldExclamation}
          >
            Change Email
          </Sidebar.Item>
          <Sidebar.Item href="/user/[id]/settings/password" icon={HiViewBoards}>
            Change Password
          </Sidebar.Item>
          <Sidebar.Item href="/user/[id]/settings/username" icon={HiUser}>
            Change Username
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiOfficeBuilding}>
            Properties
          </Sidebar.Item>
          <Sidebar.Item href="/property/tokenize" icon={HiCurrencyDollar}>
            Tokenize
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiBookOpen}>
            History
          </Sidebar.Item>
          {/* <Sidebar.Item href="#" icon={HiIdentification}>
            Wallet
          </Sidebar.Item> */}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default UserSidebar;
