import Form from "react-bootstrap/Form";

import { Controller } from "react-hook-form";

export const RHFInput = ({
  control,
  name,
  label,
  rules,
  placeholderText,
  fgClass,
  errors,
  required,
  inputType,
  defaultValue,
  helpText,
}) => {
  return (
    <Form.Group className={fgClass || ""} controlId={`select-${name}`}>
      <Form.Label>
        {label}
        {required && <span className="required-field">*</span>}
      </Form.Label>

      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue || ""}
        rules={rules || {}}
        render={({ field }) => (
          <Form.Control
            {...field}
            isInvalid={errors[name]}
            type={inputType || "number"}
            placeholder={placeholderText || "---"}
            {...(helpText ? { ariadescribedby: `${name}HelpBlock` } : {})}
          />
        )}
      />

      {helpText && (
        <Form.Text id="`${name}HelpBlock`" muted>
          {helpText}
        </Form.Text>
      )}
      {errors[name] && (
        <Form.Control.Feedback type="invalid">
          <span className="text-danger" role="alert">
            {errors[name].message}
          </span>
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
