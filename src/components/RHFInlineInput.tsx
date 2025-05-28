import React from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { DataDictOverlay } from "./DataDictOverlay";

import { Controller } from "react-hook-form";
import { RHFInputProps } from "./RHFInput";

export const RHFInlineInput: React.FC<RHFInputProps> = ({
  control,
  name,
  db_field_name,
  popup_placement,
  label,
  placeholderText,
  fgClass,
  error_message,
  required,
  inputType,
  defaultValue,
  helpText,
  disabled,
}) => {
  return (
    <Form.Group className={fgClass || ""} controlId={`select-${name}`}>
      {label && (
        <Form.Label>
          {label}
          {required && <span className="required-field">*</span>}
        </Form.Label>
      )}

      {db_field_name && (
        <DataDictOverlay
          db_field_name={db_field_name}
          popup_placement={popup_placement}
        />
      )}

      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue || ""}
        render={({ field }) => (
          <Form.Control
            {...field}
            isInvalid={!!error_message}
            type={inputType || "number"}
            placeholder={placeholderText || "---"}
            disabled={disabled || false}
            {...(helpText ? { "aria-describedby": `${name}-help-block` } : {})}
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
            aria-label={`${name}-error`}
          >
            {error_message}
          </span>
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
