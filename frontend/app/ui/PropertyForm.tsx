"use client";

import { useState } from "react";
import { Button, Label, TextInput, Select } from "flowbite-react";
import Link from "next/link";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";

interface PropertyFormProps {
  nextStep: () => void;
  prevStep?: () => void;
}

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const years = Array.from(
  { length: new Date().getFullYear() - 1899 },
  (_, index) => 1900 + index
);

const propertyTypes: { [key: string]: string[] } = {
  Residential: ["Single Family", "Multi Family", "Condominium"],
  Commercial: ["Office", "Retail", "Hotel"],
  Industrial: ["Warehouse", "Manufacturing", "Distribution"],
};

const PropertyForm: React.FC<PropertyFormProps> = ({ nextStep, prevStep }) => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | "">(
    new Date().getFullYear()
  );
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>("");
  const [selectedSubType, setSelectedSubType] = useState<string>("");

  const handlePropertyTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const type = e.target.value;
    setSelectedPropertyType(type);
    setSelectedSubType("");
  };

  const handleNext = () => {
    // Validate form fields here if necessary
    nextStep();
  };

  return (
    <form className="flex flex-col gap-4 mt-10">
      <div>
        <h5 className="mb-5 text-xl font-medium text-gray-900 dark:text-white">
          Property Address
        </h5>
        <div className="mb-2 block">
          <Label htmlFor="Country" value="Country" />
        </div>
        <Select id="countries" disabled>
          <option>United States</option>
        </Select>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="State" value="State" />
        </div>
        <Select
          id="states"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          required
          shadow
        >
          <option value="">Select State</option>
          {usStates.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Address1" value="Street Address 1" />
        </div>
        <TextInput
          id="address1"
          type="text"
          placeholder="street address 1"
          required
          shadow
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Address2" value="Street Address 2" />
        </div>
        <TextInput
          id="address2"
          type="text"
          placeholder="street address 2"
          shadow
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Zipcode" value="ZIP" />
        </div>
        <TextInput
          id="zipcode"
          type="number"
          placeholder="zipcode"
          shadow
          required
        />
      </div>
      <h5 className="mb-2 mt-5 text-xl font-medium text-gray-900 dark:text-white">
        Additional Information
      </h5>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="yearBuilt" value="Year Built" />
        </div>
        <Select
          id="yearBuilt"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          required
          shadow
        >
          <option value="">Select Year</option>
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="propertyType" value="Property Type" />
        </div>
        <Select
          id="propertyType"
          value={selectedPropertyType}
          onChange={handlePropertyTypeChange}
          required
          shadow
        >
          <option value="">Select Property Type</option>
          {Object.keys(propertyTypes).map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="subType" value="Sub Type" />
        </div>
        <Select
          id="subType"
          value={selectedSubType}
          onChange={(e) => setSelectedSubType(e.target.value)}
          disabled={!selectedPropertyType}
          required
          shadow
        >
          <option value="">Select Sub Type</option>
          {selectedPropertyType &&
            propertyTypes[selectedPropertyType].map((subtype, index) => (
              <option key={index} value={subtype}>
                {subtype}
              </option>
            ))}
        </Select>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="PropertySize" value="Property Size" />
        </div>
        <TextInput
          id="propertysize"
          type="number"
          placeholder="size in sqft"
          shadow
          required
        />
      </div>
      <div className="flex justify-between">
        {prevStep && (
          <div className="flex justify-start">
            <Button onClick={prevStep}>
              <HiOutlineArrowLeft className="h-6 w-6" />
            </Button>
          </div>
        )}
        <div className="flex justify-end">
          <Button onClick={handleNext}>
            <HiOutlineArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PropertyForm;
