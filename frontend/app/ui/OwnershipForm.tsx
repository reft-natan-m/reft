import { Button, Label, Select, TextInput } from "flowbite-react";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { FormData } from "@/app/property/tokenize/page";

interface OwnershipFormProps {
  handleSubmit: (data: FormData) => void;
  nextStep: () => void;
  prevStep?: () => void;
  formData: FormData;
}

const OwnershipForm: React.FC<OwnershipFormProps> = ({
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
