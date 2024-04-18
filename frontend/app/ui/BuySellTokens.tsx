"use client";

import { FloatingLabel, Button } from "flowbite-react";
import { FormEventHandler } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { UserSession } from "../api/auth/[...nextauth]/route";
import { Property } from "@prisma/client";

interface BuySellTokensProps {
  setOpenModal: (openModal: boolean) => void;
  totalOption: number;
  tokenPrice: number;
  data: Property;
  buttonOption: Boolean;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const BuySellTokens: React.FC<BuySellTokensProps> = ({
  setOpenModal,
  totalOption,
  tokenPrice,
  data,
  buttonOption,
}) => {
  const { data: session } = useSession();
  const userSession = session?.user as UserSession;
  const [numberOfTokens, setNumberOfTokens] = useState<number>(1);
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    if (buttonOption) {
      console.log("Insert buy logic here");
    } else {
      const formData = {
        userId: userSession.id,
        propertyId: data.id,
        tokens: numberOfTokens,
      };

      fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }
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
