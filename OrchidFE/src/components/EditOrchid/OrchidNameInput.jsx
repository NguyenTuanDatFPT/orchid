import React from 'react';
import { Form } from 'react-bootstrap';

export default function OrchidNameInput({ control, Controller, errors }) {
  return (
    <Form.Group className="mb-3" controlId="orchidNameInput">
      <Form.Label>Name</Form.Label>
      <Controller
        name="orchidName"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <Form.Control {...field} type="text" />}
      />
      {errors.orchidName && errors.orchidName.type === "required" && (
        <p className="text-warning">Name is required</p>
      )}
    </Form.Group>
  );
}
