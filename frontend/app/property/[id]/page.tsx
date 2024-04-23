import PropertyDetail from "@/app/ui/PropertyDetail";
import React from "react";

const page = () => {
  const PropertyData = {
    id: 1,
    state: "CA",
    city: `Los Angeles`,
    street1: `123 Main St`,
    street2: "",
    zip: `90000`,
    value: 500000,
    tokens: 100,
    tokenToList: 10,
    tokenPrice: 500000 / 100,
    image: "/images/Dunno.jpg",
    year: 1949,
    propType: "Residential",
    propSubtype: "Single-Family",
    size: 2100,
    expense: 1234,
    income: 12345,
    sizeValue: 500000 / 2100,
  };
  return (
    <div className="flex justify-center items-center h-screen mt-4">
      <div className="w-1/3">
        <PropertyDetail data={PropertyData} />
      </div>
    </div>
  );
};

export default page;
