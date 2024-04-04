"use client";
import React, { useState } from "react";
import Stepper from "@/app/ui/Stepper";
import TokenizeStart from "@/app/ui/TokenizeStart";
import PropertyForm from "@/app/ui/PropertyForm";
import OwnershipForm from "@/app/ui/OwnershipForm";

const Tokenize = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const isLastStep = currentStep === 7;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-screen max-w-screen-xl2 px-10 py-10">
        <Stepper currentStep={currentStep} />
      </div>
      <div className="flex flex-col justify-center max-w-4xl w-full">
        {currentStep === 0 && <TokenizeStart nextStep={nextStep} />}
        {currentStep === 1 && (
          <PropertyForm nextStep={nextStep} prevStep={prevStep} />
        )}
        {currentStep === 2 && (
          <OwnershipForm nextStep={nextStep} prevStep={prevStep} />
        )}
      </div>
    </div>
  );
};

export default Tokenize;
