import AsyncSelect from "react-select/async";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Select, { ActionMeta, ValueType } from "react-select";
import { Controller, Control, FieldValues } from "react-hook-form";

import { DataDictOverlay } from "./DataDictOverlay";

import { SelectChoice } from "../types/types";

interface RHFAsyncSelectProps<T> {
  control: Control<FieldValues, T>;
  name: string;
  label: string;
  db_field_name: string;
  popup_placement: string;
  loadOptions: SelectChoice[];
  onInputChange: (
    newValue: ValueType<SelectChoice>,
    actionMeta: ActionMeta<SelectChoice>,
  ) => void;
  placeholderText: string;
  fgClass: string;
  error_message?: string;
  required: string;
}

export const RHFAsyncSelect: React.FC<RHFAsyncSelectProps> = ({
  control,
  name,
  label,
  db_table_name,
  popup_placement,
  loadOptions,
  onInputChange,
  placeholderText,
  fgClass,
  error_message,
  required,
  rules,
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
              className={!!error_message ? "react-select-error" : ""}
            />
          )}
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
