import ChangeEmail from "@/app/ui/ChangeEmail";
import UserSidebar from "@/app/ui/UserSidebar";
import React from "react";

const Settings = () => {
  return (
    <div className="flex justify-center mt-4">
      <UserSidebar />
      <div className="flex-1 justify-center items-center h-screen ml-10 mt-10">
        <ChangeEmail />
      </div>
    </div>
  );
};

export default Settings;
