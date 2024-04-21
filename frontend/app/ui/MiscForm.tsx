import React, { useState, ChangeEvent } from "react";
import { FileInput, Label, Button } from "flowbite-react";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi";

interface MiscFormProps {
  handleSubmit: (data: FormData) => void;
  nextStep: () => void;
  prevStep?: () => void;
}

interface FormData {
  images: FileList | null;
}

const MiscForm: React.FC<MiscFormProps> = ({
  handleSubmit,
  nextStep,
  prevStep,
}) => {
  const [formData, setFormData] = useState<any>({
    images: null,
  });
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadFail, setUploadFail] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUploadFail(false);
    setUploadSuccess(false);

    if (e.target.files) {
      setFormData((prevState: FormData) => ({
        ...prevState,
        images: e.target.files,
      }));
      setUploadFail(false);
      setUploadSuccess(true);
    } else {
      setUploadFail(true);
      setUploadSuccess(false);
    }
  };

  const handleNext = () => {
    console.log(formData);
    handleSubmit(formData);
    nextStep();
  };

  return (
    <form
      className="flex flex-col justify-center gap-4 mt-10"
      onSubmit={handleNext}
    >
      <h5 className="mb-5 text-xl font-medium text-gray-900 dark:text-white">
        Upload Photos of Property
      </h5>
      <div className="flex w-full items-center justify-center">
        <Label
          htmlFor="dropzone-file"
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          color={uploadSuccess ? "success" : uploadFail ? "fail" : ""}
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <svg
              className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <FileInput
            id="dropzone-file"
            name="images"
            className="hidden"
            onChange={handleFileChange}
            multiple
            color={uploadSuccess ? "success" : uploadFail ? "fail" : ""}
            helperText={
              uploadSuccess
                ? "File(s) uploaded successfully!"
                : uploadFail
                ? "File upload failed!"
                : ""
            }
          />
        </Label>
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

export default MiscForm;
