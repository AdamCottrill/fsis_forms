import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { DataDictOverlay } from "./DataDictOverlay";

import { Controller, Control, FieldValues } from "react-hook-form";

interface RHFTextAreaProps<T> {
  control: Control<FieldValues, T>;
  name: string;
  db_field_name: string;
  popup_placement: string;
  label: string;
  placeholderText: string;
  fgClass: string;
  error_message?: string;
  required: string;
  inputType: "string" | "date" | "number";
  defaultValue: string;
  helpText: string;
}

export const RHFTextArea: React.FC<RHFTextAreaProps> = ({
  control,
  name,
  label,
  db_field_name,
  popup_placement,
  rules,
  fgClass,
  error_message,
  required,
  style,
  defaultValue,
  helpText,
}) => {
  return (
    <Form.Group className={fgClass || ""} controlId={`select-${name}`}>
      <Row className="justify-content-between">
        <Col>
          <Form.Label>
            {label}
            {required && <span className="required-field">*</span>}
          </Form.Label>
        </Col>
        {db_field_name && (
          <Col align="end">
            <DataDictOverlay
              db_field_name={db_field_name}
              popup_placement={popup_placement}
            />
          </Col>
        )}
      </Row>

      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue || ""}
        rules={rules || {}}
        render={({ field }) => (
          <Form.Control
            as="textarea"
            style={{ ...style }}
            {...field}
            isInvalid={!!error_message}
            {...(helpText ? { ariadescribedby: `${name}-help-block` } : {})}
          />
        )}
      />

      {helpText && (
        <Form.Text id="`${name}-help-block`" muted>
          {helpText}
        </Form.Text>
      )}
      {error_message && (
        <Form.Control.Feedback type="invalid">
          <span
            className="text-danger"
            role="alert"
            data-testid={`${name}-error`}
          >
            {error_message}
          </span>
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
