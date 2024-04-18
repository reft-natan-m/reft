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
  const handleSell = () => {
    setButtonOption(false);
    setOpenModal(true);
    setModalHeader("Sell Tokens");
    const numTokens = userSession.tokens.map((token: Token) => {
      if (token.propertyId === data.id && !token.listed) {
        return token.numberOfTokens;
      }
    });
    const token = numTokens.filter((value) => value !== undefined);
    if (token[0]) {
      setTotalOption(token[0]);
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
