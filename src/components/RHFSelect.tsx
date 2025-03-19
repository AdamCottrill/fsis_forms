import React from "react";
import Select from "react-select";
import Form from "react-bootstrap/Form";

import { Controller } from "react-hook-form";

export const RHFSelect = ({
  control,
  name,
  label,
  options,
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
          render={({ field: { onChange, value, ...field } }) => (
            <Select
              {...field}
              value={options?.find((x) => x.value === value)}
              onChange={(val) => onChange((val?.value||val))}
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
