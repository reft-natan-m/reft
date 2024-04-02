import ChangeEmailForm from "@/app/ui/ChangeEmailForm";
import UserSidebar from "@/app/ui/UserSidebar";
import React from "react";

const Settings = () => {
  return (
    <div className="flex justify-center">
      <UserSidebar />{" "}
      <div className="flex-1 justify-center items-center h-screen ml-10 mt-10">
        <ChangeEmailForm />
      </div>
    </div>
  );
};

export default Settings;
