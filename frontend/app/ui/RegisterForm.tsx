"use client";

import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
  activated: Boolean;
  role: string;
}

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    activated: false,
    role: "user",
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");

    const res = await fetch("/api/Users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      router.refresh();
      router.push("/Email/Verification");
    }
  };

  return (
    <div>
      <div className="flex flex-col bg-nav rounded shadow-lg p-12 mt-12">
        <h1 className="font-bold text-2xl justify-center py-4">
          Register Your Account
        </h1>
        <form onSubmit={handleSubmit} method="post">
          <label className="font-semibold text-default-text text-s">
            Username
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={handleChange}
            required={true}
            value={formData.name}
            className="flex items-center h-12 px-4 w-64 bg-gray-200 text-black mt-2 rounded focus:outline-none focus:ring-2"
          />
          <label className="font-semibold text-default-text text-s mt-3">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            onChange={handleChange}
            required={true}
            value={formData.email}
            className="flex items-center h-12 px-4 w-64 bg-gray-200 text-black mt-2 rounded focus:outline-none focus:ring-2"
          />
          <label className="font-semibold text-default-text text-s mt-3">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            required={true}
            value={formData.password}
            className="flex items-center h-12 px-4 w-64 bg-gray-200 text-black mt-2 rounded focus:outline-none focus:ring-2"
          />
          <input
            type="submit"
            value="Next"
            className="flex items-center justify-center h-12 px-6 w-64 bg-olive-900 mt-8 rounded font-semibold text-sm text-blue-100 hover:bg-olive-500"
          />
          <div className="flex mt-6 justify-center text-xs">
            <a className="text-secondary hover:text-blue-500" href="#">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
