import React, { useState } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";

interface OwnershipFormProps {
  handleSubmit: (data: FormData) => void;
  prevStep?: () => void;
}

interface FormData {
  owners: string;
  ownPercent: string;
  entity: string;
}

const OwnershipForm: React.FC<OwnershipFormProps> = ({
  handleSubmit,
  prevStep,
}) => {
  const [formData, setFormData] = useState<any>({
    owners: "",
    ownPercent: "",
    entity: "Individual",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const handleNext = () => {
    handleSubmit(formData);
  };

  return (
    <form className="flex flex-col gap-4 mt-10" onSubmit={handleNext}>
      <div>
        <h5 className="mb-5 text-xl font-medium text-gray-900 dark:text-white">
          Ownership Information
        </h5>
        <div className="mb-2 block">
          <Label htmlFor="owners" value="Owners" />
        </div>
        <TextInput
          id="owners"
          name="owners"
          type="text"
          placeholder="Enter owner names (separated by commas)"
          value={formData.owners}
          onChange={handleChange}
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
          name="ownPercent"
          type="text"
          placeholder="Enter ownership percentages (separated by commas)"
          value={formData.ownPercent}
          onChange={handleChange}
          addon="%"
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
          name="entity"
          value={formData.entity}
          onChange={handleChange}
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
          <Button type="submit">
            <HiOutlineArrowRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default OwnershipForm;
