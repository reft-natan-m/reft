"use client";

import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";

export function AlertComp() {
  return (
    <Alert
      color="failure"
      icon={HiInformationCircle}
      onDismiss={() => alert("Alert dismissed!")}
    >
      <span className="font-medium">Info alert!</span> Email already used, try
      another one or log in as that user.
    </Alert>
  );
}
