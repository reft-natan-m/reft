import { Property } from "@prisma/client";
import { Button } from "flowbite-react";
import React, { useState } from "react";
import BuySellTokens from "./BuySellTokens";
import ModalComp from "./ModalComp";

interface BuySellButtonsProps {
  data: Property;
}

const BuySellButtons: React.FC<BuySellButtonsProps> = ({ data }) => {
  const [openModal, setOpenModal] = useState(false);
  const [buttonOption, setButtonOption] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [totalOption, setTotalOption] = useState(0);

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
    setTotalOption(10);
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
