import BootAlert from "react-bootstrap/Alert";

interface AlertInterface {
  variant: string;
  dismissible: boolean;
  headingText: string;
  message: string;
}

export const Alert = ({
  variant,
  dismissible,
  headingText,
  message,
}: AlertInterface) => {
  variant = variant || "info";
  dismissible = dismissible || true;
  headingText = headingText || "Oh-oh!";
  message = message || "Something went wrong";

  return (
    <BootAlert variant={variant} dismissible={dismissible}>
      <BootAlert.Heading>{headingText}</BootAlert.Heading>
      <span>{message}</span>
    </BootAlert>
  );
};
