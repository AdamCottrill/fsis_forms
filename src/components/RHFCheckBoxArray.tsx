import { useState } from "React";
import { useController } from "react-hook-form";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

export const RHFCheckBoxArray = ({ options, control, name, errors }) => {
  const { field } = useController({
    control,
    name,
  });
  const [value, setValue] = useState(field.value || []);

  const hasError = Object.hasOwn(errors, name);

  const handleChange = (event) => {
    let valueCopy = [];
    //valueCopy[index] = e.target.checked ? e.target.value : null;
    if (event.target.checked) {
      valueCopy = [...value, event.target.value];
    } else {
      valueCopy = value.filter((x) => x != event.target.value);
    }

    field.onChange(valueCopy);
    setValue(valueCopy);
  };

  return (
    <>
      {hasError === true && (
        <div
          className="text-danger mb-2"
          role="alert"
          aria-label={`${name}-error`}
        >
          {errors[name].message}
        </div>
      )}

      <Card border={hasError ? "danger" : "light"}>
        <Card.Body>
          <Row className="row-cols-4">
            {options.map((option, index) => (
              <Col className="mb-1" key={option.code}>
                <Form.Check
                  onChange={handleChange}
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
        </Card.Body>
      </Card>
    </>
  );
};
