"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Stepper from "@/app/ui/Stepper";
import TokenizeStart from "@/app/ui/TokenizeStart";
import PropertyForm from "@/app/ui/PropertyForm";
import OwnershipForm from "@/app/ui/OwnershipForm";
import FinancialForm from "@/app/ui/FinancialForm";
import TokenizeForm from "@/app/ui/TokenizationForm";
import MiscForm from "@/app/ui/MiscForm";
import TokenizeEnd from "@/app/ui/TokenizeEnd";

interface FormData {
  country: string;
  state: string;
  city: string;
  street1: string;
  street2: string;
  zip: string;
  year: number;
  propType: string;
  propSubtype: string;
  size: number;
  owners: string;
  ownPercent: string;
  entity: string;
  value: number;
  income: number;
  expense: number;
  tokens: number;
  tokenSale: number;
  images: FileList | null;
}

const Tokenize = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    country: "United States",
    state: "",
    city: "",
    street1: "",
    street2: "",
    zip: "",
    year: 0,
    propType: "",
    propSubtype: "",
    size: 0,
    owners: "",
    ownPercent: "",
    entity: "",
    value: 0,
    income: 0,
    expense: 0,
    tokens: 100,
    tokenSale: 0,
    images: null,
  });

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (data: any) => {
    // Update formData
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    // Use updatedFormData directly
    console.log(updatedFormData);

    // Move the setCurrentStep inside the setFormData callback to ensure it's updated after the state
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleSubmitAllForms = async () => {
    console.log("Data:", formData);
    router.refresh();
    router.push("/");
    // try {
    //   const response = await fetch("/api/tokenize", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });
    //   if (response.ok) {
    //     router.refresh();
    //     router.push("/");
    //   } else {
    //     // Handle error if form submission fails
    //   }
    // } catch (error) {
    //   // Handle network error or other exceptions
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-screen max-w-screen-xl2 px-10 py-10">
        <Stepper currentStep={currentStep} />
      </div>
      <div className="flex flex-col justify-center max-w-4xl w-full mb-10">
        {currentStep === 0 && <TokenizeStart handleSubmit={handleSubmit} />}
        {currentStep === 1 && (
          <PropertyForm prevStep={prevStep} handleSubmit={handleSubmit} />
        )}
        {currentStep === 2 && (
          <OwnershipForm prevStep={prevStep} handleSubmit={handleSubmit} />
        )}
        {currentStep === 3 && (
          <FinancialForm prevStep={prevStep} handleSubmit={handleSubmit} />
        )}
        {currentStep === 4 && (
          <TokenizeForm prevStep={prevStep} handleSubmit={handleSubmit} />
        )}
        {currentStep === 5 && (
          <MiscForm prevStep={prevStep} handleSubmit={handleSubmit} />
        )}
        {currentStep === 6 && (
          <TokenizeEnd
            prevStep={prevStep}
            handleSubmitAllForms={handleSubmitAllForms}
          />
        )}
      </div>
    </div>
  );
};

export default Tokenize;
