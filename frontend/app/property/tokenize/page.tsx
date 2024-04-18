"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Stepper from "@/app/ui/Stepper";
import TokenizeStart from "@/app/ui/TokenizeStart";
import PropertyForm from "@/app/ui/PropertyForm";
// import OwnershipForm from "@/app/ui/OwnershipForm";
import FinancialForm from "@/app/ui/FinancialForm";
import TokenizeForm from "@/app/ui/TokenizationForm";
import MiscForm from "@/app/ui/MiscForm";
import TokenizeEnd from "@/app/ui/TokenizeEnd";
import { useSession } from "next-auth/react";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";

interface NewFormData {
  propertyId: string;
  images: File[];
}

export interface FormData {
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
  value: number;
  income: number;
  expense: number;
  tokens: number;
  tokenToList: number;
  images: FileList | null;
}

const Tokenize = () => {
  const { data: session } = useSession();
  const userSession = session?.user as UserSession;

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
    value: 0,
    income: 0,
    expense: 0,
    tokens: 100,
    tokenToList: 0,
    images: null,
  });

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = (data: any) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    console.log(updatedFormData);
  };

  const handleSubmitAllForms = async () => {
    let propertyData;

    const postData = {
      country: formData.country,
      state: formData.state,
      city: formData.city,
      street1: formData.street1,
      street2: formData.street2,
      zip: formData.zip,
      year: +formData.year,
      propType: formData.propType,
      propSubtype: formData.propSubtype,
      size: +formData.size,
      value: +formData.value,
      income: +formData.income,
      expense: +formData.expense,
      tokensMinted: formData.tokens,
      tokenToList: +formData.tokenToList,
      userId: userSession.id,
    };
    try {
      const res = await fetch("/api/property/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      if (res.ok) {
        propertyData = await res.json();
        console.log("data: ", propertyData);
        const images = formData.images;
        console.log("Images: ", images);

        if (images) {
          const newFormData = new FormData();
          newFormData.append("propertyId", propertyData.id);

          for (let i = 0; i < images.length; i++) {
            const file = images[i];
            newFormData.append("images", file);
          }

          console.log("NewFormData: ", newFormData);
          try {
            const uploadRes = await fetch("/api/property/upload", {
              method: "POST",
              body: newFormData,
            });
            if (uploadRes.ok) {
              // Handle success
              console.log("Upload successful");
            } else {
              // Handle error
              console.error("Upload failed");
            }
          } catch (error) {
            console.error("The uploading API did a little fucky-wucky");
          }
        }

        router.push("/");
        router.refresh();
      } else {
        alert("shit went wrong");
      }
    } catch (error) {
      // Handle network error or other exceptions
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-screen max-w-screen-xl2 px-10 py-10">
        <Stepper currentStep={currentStep} />
      </div>
      <div className="flex flex-col justify-center max-w-4xl w-full mb-10">
        {currentStep === 0 && <TokenizeStart nextStep={nextStep} />}
        {currentStep === 1 && (
          <PropertyForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            formData={formData}
          />
        )}
        {/* {currentStep === 2 && (
          <OwnershipForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            formData={formData}
          />
        )} */}
        {currentStep === 2 && (
          <FinancialForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            formData={formData}
          />
        )}
        {currentStep === 3 && (
          <TokenizeForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
            formData={formData}
          />
        )}
        {currentStep === 4 && (
          <MiscForm
            nextStep={nextStep}
            prevStep={prevStep}
            handleSubmit={handleSubmit}
          />
        )}
        {currentStep === 5 && (
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
