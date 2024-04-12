"use client";

import { FloatingLabel, Button } from "flowbite-react";

interface BuySellTokensProps {
  setOpenModal: (openModal: boolean) => void;
  totalOption: number;
}

const BuySellTokens: React.FC<BuySellTokensProps> = ({
  setOpenModal,
  totalOption,
}) => {
  const handleSubmit = () => {
    setOpenModal(false);
  };
  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-flow-col justify-stretch items-center space-x-4">
          <div>
            <FloatingLabel
              type="number"
              variant="standard"
              label="# of Tokens"
              min="1"
              max={totalOption.toString()}
              required
            />
          </div>
          <div className="w-16">{totalOption}</div>
        </div>
        <div className="flex justify-center items-center mt-4">
          <Button type="submit">Confirm</Button>
        </div>
      </form>
    </div>
  );
};

export default BuySellTokens;
