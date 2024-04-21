import { Button, Label, TextInput } from "flowbite-react";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";
import { FormData } from "@/app/property/tokenize/page";

interface TokenizeFormProps {
  handleSubmit: (data: FormData) => void;
  nextStep: () => void;
  prevStep?: () => void;
  formData: FormData;
}

const TokenizeForm: React.FC<TokenizeFormProps> = ({
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
          Tokenization Information
        </h5>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="TokenNumber" value="Number of Tokens" />
          </div>
          <TextInput
            id="tokennumber"
            name="tokens"
            type="number"
            placeholder="100"
            value={formData.tokens}
            onChange={handleChange}
            required
            shadow
            disabled
          />
        </div>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="SellNumber" value="Number of Tokens for Sale" />
        </div>
        <TextInput
          id="sellnumber"
          name="tokenToList"
          type="number"
          placeholder="Number of Tokens to List"
          value={formData.tokenToList}
          onChange={handleChange}
          required
          shadow
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

export default TokenizeForm;
