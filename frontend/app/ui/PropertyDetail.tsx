import React from "react";
import { PropertyData, BuySellData } from "./CardData";
import GalleryComp from "@/app/ui/GalleryComp";
import BuySellButtons from "./BuySellButtons";
import { Property } from "@prisma/client";

interface PropertyDetailProps {
  data: Property;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PropertyDetail: React.FC<PropertyDetailProps> = ({ data }) => {
  return (
    <div className="flex">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        <li>
          <div className="mb-4">
            <GalleryComp />
          </div>
        </li>
        <li>
          <div className="mt-4 mb-4">
            <div className="flex justify-between">
              <div className="order-2">
                <BuySellButtons data={data} />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex justify-between">
                  <h5 className="text-start text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {formatter.format(data.value)}
                  </h5>
                </div>
                <h5 className="text-start text-lg font-bold tracking-tight text-gray-600 dark:text-gray-400">
                  {data.street1}, {data.city}, {data.state}, {data.zip}
                </h5>
              </div>
            </div>
          </div>
        </li>
        <li>
          <div className="flex flex-col mt-4 mb-4">
            <div className="grid grid-cols-3">
              <h5 className="text-start text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {data.tokensforSale}
              </h5>
              <h5 className="text-start text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {data.tokensMinted}
              </h5>
              <h5 className="text-start text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {formatter.format(data.value / data.tokensMinted)}
              </h5>
            </div>
            <div className="grid grid-cols-3">
              <h5 className="text-start text-lg font-bold tracking-tight text-gray-600 dark:text-gray-400">
                Tokens For Sale
              </h5>
              <h5 className="text-start text-lg font-bold tracking-tight text-gray-600 dark:text-gray-400">
                Total Tokens
              </h5>
              <h5 className="text-start text-lg font-bold tracking-tight text-gray-600 dark:text-gray-400">
                Price Per Token
              </h5>
            </div>
          </div>
        </li>
        <li>
          <div className="grid grid-cols-3 mt-4 mb-4 gap-4">
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              {data.propSubtype} {data.propType}
            </div>
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              {data.size} sqft
            </div>
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              {formatter.format(data.value / data.size)}/sqft
            </div>
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              Built in {data.year}
            </div>
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              {formatter.format(data.expense)} Expenses/year
            </div>
            <div className="flex justify-center items-center bg-gray-800 border-2 border-gray-400 text-center font-bold">
              {formatter.format(data.income)} Income/year
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default PropertyDetail;
