import { useEffect, useState } from "react";
import { Button, Label, TextInput, Select } from "flowbite-react";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { FormData } from "@/app/property/tokenize/page";

interface PropertyFormProps {
  nextStep: () => void;
  prevStep?: () => void;
  handleSubmit: (data: FormData) => void;
  formData: FormData;
}

const usStates = [
  "AL", // Alabama
  "AK", // Alaska
  "AZ", // Arizona
  "AR", // Arkansas
  "CA", // California
  "CO", // Colorado
  "CT", // Connecticut
  "DE", // Delaware
  "FL", // Florida
  "GA", // Georgia
  "HI", // Hawaii
  "ID", // Idaho
  "IL", // Illinois
  "IN", // Indiana
  "IA", // Iowa
  "KS", // Kansas
  "KY", // Kentucky
  "LA", // Louisiana
  "ME", // Maine
  "MD", // Maryland
  "MA", // Massachusetts
  "MI", // Michigan
  "MN", // Minnesota
  "MS", // Mississippi
  "MO", // Missouri
  "MT", // Montana
  "NE", // Nebraska
  "NV", // Nevada
  "NH", // New Hampshire
  "NJ", // New Jersey
  "NM", // New Mexico
  "NY", // New York
  "NC", // North Carolina
  "ND", // North Dakota
  "OH", // Ohio
  "OK", // Oklahoma
  "OR", // Oregon
  "PA", // Pennsylvania
  "RI", // Rhode Island
  "SC", // South Carolina
  "SD", // South Dakota
  "TN", // Tennessee
  "TX", // Texas
  "UT", // Utah
  "VT", // Vermont
  "VA", // Virginia
  "WA", // Washington
  "WV", // West Virginia
  "WI", // Wisconsin
  "WY", // Wyoming
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

const PropertyForm: React.FC<PropertyFormProps> = ({
  nextStep,
  prevStep,
  handleSubmit,
  formData,
}) => {
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>(
    formData.propType || ""
  );

  useEffect(() => {
    setSelectedPropertyType(formData.propType || "");
  }, [formData.propType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    handleSubmit({ ...formData, [name]: value });
  };

  const handlePropertyTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const type = e.target.value;
    setSelectedPropertyType(type);
    handleSubmit({ ...formData, propType: type });
  };

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form className="flex flex-col gap-4 mt-10" onSubmit={handleNext}>
      <div>
        <h5 className="mb-5 text-xl font-medium text-gray-900 dark:text-white">
          Property Address
        </h5>
        <div className="mb-2 block">
          <Label htmlFor="Country" value="Country" />
        </div>
        <Select id="countries" name="country" disabled>
          <option>United States</option>
        </Select>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="State" value="State" />
        </div>
        <Select
          id="states"
          name="state"
          value={formData.state}
          onChange={handleChange}
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
          <Label htmlFor="City" value="City" />
        </div>
        <TextInput
          id="city"
          name="city"
          type="text"
          placeholder="city"
          onChange={handleChange}
          value={formData.city}
          required
          shadow
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Address1" value="Street Address 1" />
        </div>
        <TextInput
          id="address1"
          name="street1"
          type="text"
          placeholder="street address 1"
          onChange={handleChange}
          value={formData.street1}
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
          name="street2"
          type="text"
          placeholder="street address 2"
          onChange={handleChange}
          value={formData.street2}
          shadow
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="Zipcode" value="ZIP" />
        </div>
        <TextInput
          id="zipcode"
          name="zip"
          type="text"
          placeholder="zipcode"
          onChange={handleChange}
          value={formData.zip}
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
          name="year"
          onChange={handleChange}
          value={formData.year}
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
          name="propType"
          value={formData.propType}
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
          name="propSubtype"
          value={formData.propSubtype}
          onChange={handleChange}
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
          <Label htmlFor="PropertySize" value="Property Size (sqft)" />
        </div>
        <TextInput
          id="propertysize"
          name="size"
          type="number"
          placeholder="size in sqft"
          onChange={handleChange}
          value={formData.size}
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
          <Button type="submit">
            <HiOutlineArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PropertyForm;
