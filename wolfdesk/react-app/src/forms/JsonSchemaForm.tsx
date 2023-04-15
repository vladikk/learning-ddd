import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { JSONSchema7 } from "json-schema";

interface Props {
  schema: JSONSchema7;
}

const JsonSchemaForm = ({ schema }: Props) => {
  const [formState, setFormState] = useState<Record<string, any>>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formState);
  };

  const renderFields = () =>
    Object.entries(schema.properties!).map(([name, field]) => {
      const { description = name, type } = field as JSONSchema7;
      return (
        <Form.Group key={name} controlId={name}>
          <Form.Label>{description}</Form.Label>
          <Form.Control
            type={type === "string" ? "text" : "number"}
            placeholder={`Enter ${description}`}
            name={name}
            value={formState[name] || ""}
            onChange={handleChange}
          />
        </Form.Group>
      );
    });

  return (
    <Form onSubmit={handleSubmit}>
      {renderFields()}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default JsonSchemaForm;
