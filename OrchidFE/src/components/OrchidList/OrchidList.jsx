import React from 'react';
import { Row, Col } from 'react-bootstrap';
import OrchidCard from '../OrchidCard';

function OrchidList({ orchids, onAddToCart }) {
  return (
    <Row className="mt-3 g-4">
      {orchids.map((item) => (
        <Col md={4} key={item.id}>
          <OrchidCard item={item} onAddToCart={onAddToCart} />
        </Col>
      ))}
    </Row>
  );
}

export default OrchidList;
