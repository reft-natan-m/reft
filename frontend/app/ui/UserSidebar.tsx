"use client";

import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiShieldExclamation,
  HiInbox,
  HiShoppingBag,
  HiTable,
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
          <Sidebar.Item href="#" icon={HiInbox}>
            Properties
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiArrowSmRight}>
            History
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag}>
            Wallet
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default UserSidebar;
