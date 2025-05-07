import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { DataDictOverlay } from "./DataDictOverlay";

import { Controller } from "react-hook-form";

export const RHFTextArea = ({
  control,
  name,
  label,
  db_field_name,
  popup_placement,
  rules,
  fgClass,
  errors,
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
            isInvalid={errors[name]}
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
          <span
            className="text-danger"
            role="alert"
            data-testid={`${name}-error`}
          >
            {errors[name].message}
          </span>
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
