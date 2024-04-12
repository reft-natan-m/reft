"use client";

import { Button, Modal, Select } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ModalCompProps {
  children: React.ReactNode;
  setOpenModal: (open: boolean) => void;
  openModal: boolean;
}

const ModalComp: React.FC<ModalCompProps> = ({
  children,
  openModal,
  setOpenModal,
}) => {
  return (
    <div>
      <Modal
        dismissible
        show={openModal}
        size="3xl"
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header>Property Details</Modal.Header>
        <Modal.Body>
          <div>{children}</div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalComp;
