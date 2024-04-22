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
        process for your property. Next your information will be processed and
        verified. Once that is complete your property will be transformed into
        tokens, allowing you to trade them on the blockchain.
        <br />
        <br />
        The verification process may take anywhere from one to five business
        days to complete. During this time, you will receive email updates on
        the progress of the verification process.
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
            Finalize Tokenization
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenizeEnd;
