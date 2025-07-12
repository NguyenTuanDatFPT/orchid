import React from 'react';
import { Form } from 'react-bootstrap';

export default function OrchidImageInput({ control, Controller, errors }) {
  return (
    <Form.Group className="mb-3" controlId="orchidImageInput">
      <Form.Label>Image</Form.Label>
      <Controller
        name="image"
        control={control}
        rules={{ required: true, pattern: /(https?:\/\/[^"]+)/i }}
        render={({ field }) => <Form.Control {...field} type="text" />}
      />
      {errors.image && errors.image.type === "pattern" && (
        <p className="text-warning">Image must be a valid URL</p>
      )}
    </Form.Group>
  );
}
