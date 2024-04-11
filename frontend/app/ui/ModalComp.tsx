"use client";

import { useEffect } from "react";

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const ModalComp: React.FC<ModalProps> = ({ onClose, children }) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".modal-content")) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="absolute bg-white rounded-lg shadow-lg p-6 modal-content">
        {children}
      </div>
    </div>
  );
};

export default ModalComp;
