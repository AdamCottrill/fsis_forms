import AsyncSelect from "react-select/async";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { DataDictOverlay } from "./DataDictOverlay";

import { Controller } from "react-hook-form";

export const RHFAsyncSelect = ({
  control,
  name,
  label,
  db_table_name,
  popup_placement,
  loadOptions,
  onInputChange,
  rules,
  placeholderText,
  fgClass,
  errors,
  required,
}) => {
  return (
    <>
      <Form.Group className={fgClass || ""} controlId={`select-${name}`}>
        <Row>
          <Col>
            <Form.Label>
              {label}
              {required && <span className="required-field">*</span>}
            </Form.Label>
          </Col>

          {db_table_name && (
            <Col align="end">
              <DataDictOverlay
                db_table_name={db_table_name}
                popup_placement={popup_placement}
              />
            </Col>
          )}
        </Row>

        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => (
            <AsyncSelect
              {...field}
              inputId={`select-${name}`}
              defaultOptions={[]}
              loadOptions={loadOptions}
              onInputChange={onInputChange}
              placeholder={
                <div className="select-placeholder-text">
                  {placeholderText || "---"}
                </div>
              }
              className={errors[name] ? "react-select-error" : ""}
            />
          )}
        />

        {errors[name] && (
          <span
            className="text-danger"
            role="alert"
            aria-label={`${name}-error`}
          >
            {errors[name]?.message}
          </span>
        )}
      </Form.Group>
    </>
  );
};
