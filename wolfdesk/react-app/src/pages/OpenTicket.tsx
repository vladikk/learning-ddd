import { JSONSchema7 } from "json-schema";
import React from "react";
import { Container } from "react-bootstrap";
import JsonSchemaForm from "../forms/JsonSchemaForm";

const schema: JSONSchema7 = {
  type: "object",
  properties: {
    productId: {
      type: "string",
      format: "uuid",
      description: "Product",
    },
    supportCategoryId: {
      type: "string",
      format: "uuid",
      description: "Support Category",
    },
    priority: {
      type: "string",
      enum: ["Low", "Medium", "High"],
      description: "Priority",
    },
    title: {
      type: "string",
      minLength: 1,
    },
    message: {
      type: "string",
      minLength: 1,
    },
    closeAfter: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["productId", "supportCategoryId", "priority", "title", "message"],
  description: "Opens a new ticket",
};

export const OpenTicketRoute: React.FC = () => {
  return (
    <Container>
      <h1>Open Ticket</h1>
      <JsonSchemaForm schema={schema} />
    </Container>
  );
};
