import React from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { FormData } from "@/app/property/tokenize/page";

interface OwnershipFormProps {
  handleSubmit: (data: FormData) => void;
  nextStep: () => void;
  prevStep?: () => void;
  formData: FormData;
}

const FinancialForm: React.FC<OwnershipFormProps> = ({
  handleSubmit,
  nextStep,
  prevStep,
  formData,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    handleSubmit({ ...formData, [name]: value });
  };

  const handleNext = () => {
    nextStep();
  };

  return (
    <form className="flex flex-col gap-4 mt-10" onSubmit={handleNext}>
      <h5 className="mb-5 text-xl font-medium text-gray-900 dark:text-white">
        Financial Information
      </h5>
      <div>
        <Label htmlFor="marketValue" value="Current Market Value (USD)" />
        <TextInput
          id="marketValue"
          name="value"
          type="number"
          placeholder="market value of the property"
          value={formData.value}
          onChange={handleChange}
          addon="$"
          required
          shadow
        />
      </div>
      <div>
        <Label htmlFor="annualIncome" value="Annual Income (USD)" />
        <TextInput
          id="annualIncome"
          name="income"
          type="number"
          placeholder="annual income of the property"
          value={formData.income}
          onChange={handleChange}
          addon="$"
          required
          shadow
        />
      </div>
      <div>
        <Label htmlFor="annualExpenses" value="Annual Expenses (USD)" />
        <TextInput
          id="annualExpenses"
          name="expense"
          type="number"
          placeholder="annual expenses of the property"
          value={formData.expense}
          onChange={handleChange}
          addon="$"
          required
          shadow
        />
      </div>
      <div className="flex justify-between">
        <Button type="button" onClick={prevStep}>
          <HiOutlineArrowLeft className="h-6 w-6" />
        </Button>
        <Button type="submit">
          <HiOutlineArrowRight className="h-6 w-6" />
        </Button>
      </div>
    </form>
  );
};

export default FinancialForm;
