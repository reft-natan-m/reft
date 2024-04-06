import React, { ChangeEvent } from "react";
import { FloatingLabel } from "flowbite-react";

interface PasswordConfirmationProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string;
}

const EnterPass: React.FC<PasswordConfirmationProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <>
      <FloatingLabel
        style={{ width: "750px" }}
        variant="standard"
        label="Confirm Password"
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </>
  );
};

export default EnterPass;
