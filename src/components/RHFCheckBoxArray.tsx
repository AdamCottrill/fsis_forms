import { useState } from "React";
import { useController } from "react-hook-form";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

export const RHFCheckBoxArray = ({ options, control, name, errors }) => {
  const { field } = useController({
    control,
    name,
  });
  const [value, setValue] = useState(field.value || []);

  return (
    <>
      {errors[name] && (
        <div
          className="text-danger mb-1"
          role="alert"
          aria-label={`${name}-error`}
        >
          {errors[name].message}
        </div>
      )}

      <Row className="row-cols-4">
        {options.map((option, index) => (
          <Col className="mb-1" md={4} key={option.code}>
            <Form.Check
              onChange={(e) => {
                const valueCopy = [...value];
                valueCopy[index] = e.target.checked ? e.target.value : null;
                field.onChange(valueCopy);
                setValue(valueCopy);
              }}
              key={option.code}
              inline
              label={`${option.description} (${option.code})`}
              name={name}
              type="checkbox"
              value={option.code}
              checked={value.includes(option.code)}
            />
          </Col>
        ))}
      </Row>
    </>
  );
};
