import React from 'react';
import { FormGroup, Form } from 'react-bootstrap';

export default function OrchidNaturalSwitch({ register }) {
  return (
    <FormGroup>
      <Form.Check
        type="switch"
        id="custom-switch"
        label="Natural"
        {...register("isNatural")}
      />
    </FormGroup>
  );
}
