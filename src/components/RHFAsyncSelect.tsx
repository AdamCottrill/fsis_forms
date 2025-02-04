import AsyncSelect from "react-select/async";
import Form from "react-bootstrap/Form";

import { Controller } from "react-hook-form";

export const RHFAsyncSelect = ({
  control,
  name,
  label,
  stateValue,
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
        <Form.Label>
          {label}
          {required && <span className="required-field">*</span>}
        </Form.Label>

        <Controller
          control={control}
          name={name}
          render={({ ...field }) => (
            <AsyncSelect
              {...field}
              inputId={`select-${name}`}
              defaultOptions={[]}
              value={stateValue}
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
          rules={rules}
        />

        {errors[name] && (
          <span className="text-danger" role="alert">
            {errors[name]?.message}
          </span>
        )}
      </Form.Group>
    </>
  );
};
