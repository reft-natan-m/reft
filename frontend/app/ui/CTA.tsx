import Link from "next/link";
import React from "react";

interface ButtonProps {
  href: string;
  text: string;
  onClick?: () => void; // Optional onClick handler
}

const CTA: React.FC<ButtonProps> = ({ href, text, onClick }) => {
  return (
    <div className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
      <Link href={href} onClick={onClick}>
        <button>{text}</button>
      </Link>
    </div>
  );
};

export default CTA;
