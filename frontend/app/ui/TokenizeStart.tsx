import React from "react";

interface TokenizeStartProps {
  nextStep: () => void;
}

const TokenizeStart: React.FC<TokenizeStartProps> = ({ nextStep }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-medium mb-4">
        Welcome to Real Estate Tokenization
      </h2>
      <p className="text-center font-medium text-gray-900 dark:text-white mb-8">
        This platform allows you to tokenize real estate properties and trade
        them on a blockchain. You'll go through a few steps to tokenize your
        property.
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={nextStep}
      >
        Get Started
      </button>
    </div>
  );
};

export default TokenizeStart;
