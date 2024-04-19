import { Property, Token } from "@prisma/client";
import { Button } from "flowbite-react";
import React, { useState } from "react";
import BuySellTokens from "./BuySellTokens";
import ModalComp from "./ModalComp";
import { useSession } from "next-auth/react";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";

interface BuySellButtonsProps {
  data: Property;
}

const BuySellButtons: React.FC<BuySellButtonsProps> = ({ data }) => {
  const [openModal, setOpenModal] = useState(false);
  const [buttonOption, setButtonOption] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [totalOption, setTotalOption] = useState(0);

  const { data: session } = useSession();
  const userSession = session?.user as UserSession;

  const handleBuy = () => {
    setButtonOption(true);
    setOpenModal(true);
    setModalHeader("Buy Tokens");
    if (data.tokensforSale) {
      setTotalOption(data.tokensforSale);
    } else {
      setTotalOption(0);
    }
  };
  const handleSell = async () => {
    setButtonOption(false);
    setOpenModal(true);
    setModalHeader("Sell Tokens");
    try {
      // Get user email from session
      const userEmail = userSession.email;

      // Call the API to get user data
      const response = await fetch(`/api/user?email=${userEmail}`);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      // Parse the JSON response
      const userData = await response.json();

      // Extract tokens from user data
      const tokens = userData.tokens;

      // Calculate total tokens for sale
      const numTokens = tokens.map((token: Token) => {
        if (token.propertyId === data.id && !token.listed) {
          return token.numberOfTokens;
        }
      });
      const token = numTokens.filter(
        (value: number | undefined) => value !== undefined
      );
      if (token[0]) {
        setTotalOption(token[0]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <div>
      <ModalComp
        openModal={openModal}
        setOpenModal={setOpenModal}
        modalHeader={modalHeader}
        modalSize="sm"
      >
        <div>
          {buttonOption ? (
            <div>
              <BuySellTokens
                setOpenModal={setOpenModal}
                totalOption={totalOption}
                tokenPrice={data.value / data.tokensMinted}
                data={data}
                buttonOption={buttonOption}
              />
            </div>
          ) : (
            <div>
              <BuySellTokens
                setOpenModal={setOpenModal}
                totalOption={totalOption}
                tokenPrice={data.value / data.tokensMinted}
                data={data}
                buttonOption={buttonOption}
              />
            </div>
          )}
        </div>
      </ModalComp>
      <div className="w-48 flex flex-col justify-center items-center gap-4 shadow-lg shadow-gray-900 rounded-lg">
        <div>
          <Button onClick={handleBuy} className="w-32 mt-4">
            Buy Tokens
          </Button>
        </div>
        <div>
          <Button onClick={handleSell} className="w-32 mb-4">
            Sell Tokens
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuySellButtons;
