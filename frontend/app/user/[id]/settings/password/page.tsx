import ChangePassword from "@/app/ui/ChangePassword";
import UserSidebar from "@/app/ui/UserSidebar";
import React from "react";

const SettingsPassword = () => {
  return (
    <div className="flex justify-center mt-4">
      <UserSidebar />
      <div className="flex-1 justify-center items-center h-screen ml-10 mt-10">
        <ChangePassword />
      </div>
    </div>
  );
};

export default SettingsPassword;
