"use client";

import { Button, Modal, Select } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ModalCompProps {
  children: React.ReactNode;
  setOpenModal: (open: boolean) => void;
  openModal: boolean;
  modalHeader: string;
  modalSize: string;
}

const ModalComp: React.FC<ModalCompProps> = ({
  children,
  openModal,
  setOpenModal,
  modalHeader,
  modalSize,
}) => {
  return (
    <div>
      <Modal
        dismissible
        show={openModal}
        size={modalSize}
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>{modalHeader}</Modal.Header>
        <Modal.Body>
          <div>{children}</div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalComp;
