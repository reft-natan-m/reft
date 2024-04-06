"use client";

import { FloatingLabel } from "flowbite-react";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  email: string;
  password: string;
}

function ChangeEmail() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "test",
  });

  const [emailConfirmation, setEmailConfirmation] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const handlePasswordConfirmationChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setPasswordConfirmation(e.target.value);
    setPasswordError("");
  };

  const handleEmailConfirmationChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setEmailConfirmation(e.target.value);
    setEmailError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (formData.password !== passwordConfirmation) {
      setPasswordError("Passwords do not match");
      return;
    } else if (formData.email !== emailConfirmation) {
      setEmailError("Emails do not match");
      return;
    }

    // Form submission logic
  };
  return (
    <div className="flex-col justify-center">
      <form className="space-y-6" onSubmit={handleSubmit} method="post">
        <div className="max-w-6xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex mt-4 ml-4 mb-10">
            <h5 className="mr-20 mt-4" style={{ width: "250px" }}>
              Enter your present password to continue:
            </h5>
            <FloatingLabel
              style={{ width: "750px" }}
              variant="standard"
              label="Current Password"
              onChange={handlePasswordConfirmationChange}
              helperText="You must enter your current password if you wish to change your password or email address."
            />
          </div>
          <div className="flex items-start">
            <div className="flex items-start">
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-6xl p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex mt-4 ml-4">
            <h5 className="mr-20 mt-4" style={{ width: "250px" }}>
              New Email Address:
            </h5>
            <FloatingLabel
              style={{ width: "750px" }}
              variant="standard"
              label="New Email"
            />
          </div>
          <div className="flex mt-4 ml-4">
            <h5 className="mr-20 mt-4" style={{ width: "250px" }}>
              Confirm Email Address:
            </h5>
            <FloatingLabel
              style={{ width: "750px" }}
              variant="standard"
              label="Confirm New Email"
              onChange={handleEmailConfirmationChange}
            />
          </div>
          <div className="flex items-start">
            <div className="flex items-start">
              {emailError && (
                <p className="text-red-500 text-sm">{emailError}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-left">
          <input
            type="submit"
            value="Update Email"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          />
        </div>
      </form>
    </div>
  );
}

export default ChangeEmail;
