import React, { useState } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";

interface OwnershipFormProps {
  nextStep: () => void;
  prevStep?: () => void;
}

const OwnershipForm: React.FC<OwnershipFormProps> = ({
  nextStep,
  prevStep,
}) => {
  const [owners, setOwners] = useState<string>("");
  const [percentages, setPercentages] = useState<string>("");
  const [entityType, setEntityType] = useState<string>("Individual");

  const handleNext = () => {
    // Validate and process the owners, percentages, and entityType data if necessary
    nextStep();
  };

  return (
    <form className="flex flex-col gap-4 mt-10">
      <div>
        <h5 className="mb-5 text-xl font-medium text-gray-900 dark:text-white">
          Ownership Information
        </h5>
        <div className="mb-2 block">
          <Label htmlFor="owners" value="Owners" />
        </div>
        <TextInput
          id="owners"
          type="text"
          placeholder="Enter owner names (separated by commas)"
          value={owners}
          onChange={(e) => setOwners(e.target.value)}
          required
          shadow
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="percentages" value="Ownership Percentages" />
        </div>
        <TextInput
          id="percentages"
          type="text"
          placeholder="Enter ownership percentages (separated by commas)"
          value={percentages}
          onChange={(e) => setPercentages(e.target.value)}
          required
          shadow
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="entityType" value="Legal Entity Type" />
        </div>
        <Select
          id="entityType"
          value={entityType}
          onChange={(e) => setEntityType(e.target.value)}
          required
          shadow
        >
          <option value="Individual">Individual</option>
          <option value="Corporation">Corporation</option>
          <option value="LLC">LLC</option>
        </Select>
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

export default OwnershipForm;
