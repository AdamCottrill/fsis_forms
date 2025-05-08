import BootAlert from "react-bootstrap/Alert";

interface AlertInterface {
  variant: string;
  dismissible: boolean;
  headingText: string;
  message: string;
}

export const Alert = ({
  variant,
  dismissible = true,
  headingText,
  message,
  ...rest
}: AlertInterface) => {
  variant = variant || "info";
  headingText = headingText || "Oh-oh!";
  message = message || "Something went wrong";

  return (
    <BootAlert variant={variant} dismissible={dismissible} {...rest}>
      <BootAlert.Heading>{headingText}</BootAlert.Heading>
      <span>{message}</span>
    </BootAlert>
  );
};
