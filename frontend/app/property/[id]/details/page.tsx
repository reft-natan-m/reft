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
    tokenForSale: 10,
    tokenPrice: 500000 / 100,
    image: "/images/Dunno.jpg",
    year: 1949,
    propType: "Residential",
    propSubtype: "Single-Family",
    size: 2100,
    expense: 1234,
    income: 12345,
    sizeValue: 500000 / 2100,
    owners: "",
    ownPercent: "",
    entity: "",
  };
  return (
    <div>
      <PropertyDetail data={PropertyData} />
    </div>
  );
};

export default page;
