import { Button } from "flowbite-react";
import React, { useState } from "react";
import BuySellTokens from "./BuySellTokens";
import { BuySellData } from "./CardData";
import ModalComp from "./ModalComp";

interface BuySellButtonsProps {
  bsTotals: BuySellData;
}

const BuySellButtons: React.FC<BuySellButtonsProps> = ({ bsTotals }) => {
  const [openModal, setOpenModal] = useState(false);
  const [buttonOption, setButtonOption] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [totalOption, setTotalOption] = useState(0);

  const handleBuy = () => {
    setButtonOption(true);
    setOpenModal(true);
    setModalHeader("Buy Tokens");
    setTotalOption(bsTotals.buyTotal);
  };
  const handleSell = () => {
    setButtonOption(false);
    setOpenModal(true);
    setModalHeader("Sell Tokens");
    setTotalOption(bsTotals.sellTotal);
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
              />
            </div>
          ) : (
            <div>
              <BuySellTokens
                setOpenModal={setOpenModal}
                totalOption={totalOption}
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
