import React from "react";
import Link from "next/link";

interface TokenizeStartProps {
  prevStep?: () => void;
  handleSubmitAllForms: () => void;
}

const TokenizeEnd: React.FC<TokenizeStartProps> = ({
  prevStep,
  handleSubmitAllForms,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-medium mb-4">Congratulations!</h2>
      <p className="text-center font-medium text-gray-900 dark:text-white mb-8">
        You have successfully completed the first step in the tokenization
        process for your property. Once you finialize the process, you will be
        able to mint your property tokens.
      </p>
      <div className="flex justify-between w-full">
        <div className="flex justify-start">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={prevStep}
          >
            Go Back
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmitAllForms}
          >
            Finalize
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenizeEnd;
