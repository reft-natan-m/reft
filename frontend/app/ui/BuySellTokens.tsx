"use client";

import { FloatingLabel, Button } from "flowbite-react";
import { useState } from "react";

interface BuySellTokensProps {
  setOpenModal: (openModal: boolean) => void;
  totalOption: number;
  tokenPrice: number;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const BuySellTokens: React.FC<BuySellTokensProps> = ({
  setOpenModal,
  totalOption,
  tokenPrice,
}) => {
  const [numberOfTokens, setNumberOfTokens] = useState<number>(1);
  const handleSubmit = () => {
    setOpenModal(false);
  };
  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(event.target.value);
    setNumberOfTokens(inputValue);
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
              value={numberOfTokens.toString()}
              onChange={handleTokenChange}
              required
            />
          </div>
          <div className="w-16"> / {totalOption}</div>
        </div>
        <div>
          Estimated value: {formatter.format(tokenPrice * numberOfTokens)}
        </div>
        <div className="flex justify-center items-center mt-4">
          <Button type="submit">Confirm</Button>
        </div>
      </form>
    </div>
  );
};

export default BuySellTokens;
