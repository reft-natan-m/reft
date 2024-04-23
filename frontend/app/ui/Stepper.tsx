import React from "react";

interface StepperProps {
  currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const stepLabels = [
    "Start",
    "Property",
    //"Ownership",
    "Financial",
    "Tokenization",
    "Miscellaneous",
    "Confirmation",
  ];

  return (
    <div>
      <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
        {stepLabels.map((label, index) => (
          <li
            key={index}
            className={`flex md:w-full items-center ${
              index < currentStep
                ? "text-blue-600 dark:text-blue-500 sm:after:content-['']"
                : " after:content-['']"
            } ${
              index != 5
                ? "after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"
                : ""
            }`}
          >
            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              {index < currentStep ? (
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
              ) : (
                <span className="me-2">{index}</span>
              )}
              {/* Display step label */}
              <span className="hidden sm:inline-flex sm:ms-2">{label}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Stepper;
