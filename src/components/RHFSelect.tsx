import Select from "react-select";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { DataDictOverlay } from "./DataDictOverlay";

import { Controller } from "react-hook-form";

export const RHFSelect = ({
  control,
  name,
  db_table_name,
  popup_placement,
  label,
  options,
  rules,
  placeholderText,
  fgClass,
  error_message,
  required,
  ...rest
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
          render={({ field: { onChange, value, ...field } }) => (
            <Select
              {...field}
              value={options?.find((x) => x.value === value) || ""}
              onChange={(val) => onChange(val?.value || val)}
              isClearable={true}
              inputId={`select-${name}`}
              placeholder={
                <div className="select-placeholder-text">
                  {placeholderText || "---"}
                </div>
              }
              options={options}
              isLoading={!options}
              closeMenuOnSelect={true}
              className={!!error_message ? "react-select-error" : ""}
              {...rest}
            />
          )}
          rules={rules}
        />

        {error_message && (
          <span
            className="text-danger"
            role="alert"
            aria-label={`${name}-error`}
          >
            {error_message}
          </span>
        )}
      </Form.Group>
    </>
  );
};
