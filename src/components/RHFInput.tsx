import React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { DataDictOverlay } from "./DataDictOverlay";

import { Controller } from "react-hook-form";

//type RHFInputProps = {
//  //  type: string;
//  //  placeholder: string;
//  //  name: ValidFieldNames;
//  //  register: UseFormRegister<FormData>;
//  //  error: FieldError | undefined;
//  //  valueAsNumber?: boolean;
//  control,
//  name,
//  db_field_name,
//  popup_placement,
//  label,
//  rules,
//  placeholderText,
//  fgClass,
//  errors,
//  required,
//  inputType,
//  defaultValue,
//  helpText,
//
//};

export const RHFInput = ({
  control,
  name,
  db_field_name,
  popup_placement,
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
          <span
            className="text-danger"
            role="alert"
            aria-label={`${name}-error`}
          >
            {errors[name].message}
          </span>
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
