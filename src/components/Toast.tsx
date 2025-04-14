import React, { useState } from "react";
import BootToast from "react-bootstrap/Toast";

interface ToastInterface {
  variant: string;
  headingText: string;
  message: string;
}

export const Toast = ({ variant, headingText, message }: ToastInterface) => {
  const [show, setShow] = useState(true);
  const toggleShow = () => setShow(!show);

  return (
    <BootToast bg={variant} show={show} onClose={toggleShow}>
      <BootToast.Header>
        <strong className="me-auto">{headingText}</strong>
      </BootToast.Header>
      <BootToast.Body>{message}.</BootToast.Body>
    </BootToast>
  );
};
