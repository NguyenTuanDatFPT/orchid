import React from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import styles from './OrchidForm.module.css';

export default function OrchidForm({ control, register, errors, handleSubmit, onSubmit, editMode }) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="formName" className="mb-3">
        <Form.Label className={styles.formLabel}>Tên hoa lan</Form.Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Form.Control {...field} isInvalid={!!errors.name} />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formDescription" className="mb-3">
        <Form.Label className={styles.formLabel}>Mô tả</Form.Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Form.Control as="textarea" rows={2} {...field} isInvalid={!!errors.description} />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group controlId="formPrice" className="mb-3">
            <Form.Label className={styles.formLabel}>Giá</Form.Label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Form.Control type="number" step="0.01" min="0" {...field} isInvalid={!!errors.price} />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.price?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="formStock" className="mb-3">
            <Form.Label className={styles.formLabel}>Tồn kho</Form.Label>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <Form.Control type="number" min="0" {...field} isInvalid={!!errors.stock} />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.stock?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="formImageUrl" className="mb-3">
        <Form.Label className={styles.formLabel}>Ảnh</Form.Label>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <Form.Control {...field} isInvalid={!!errors.imageUrl} />
          )}
        />
        <Form.Control.Feedback type="invalid">
          {errors.imageUrl?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Row>
        <Col md={4}>
          <Form.Group controlId="formOrigin" className="mb-3">
            <Form.Label className={styles.formLabel}>Xuất xứ</Form.Label>
            <Controller
              name="origin"
              control={control}
              render={({ field }) => (
                <Form.Control {...field} isInvalid={!!errors.origin} />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.origin?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="formColor" className="mb-3">
            <Form.Label className={styles.formLabel}>Màu sắc</Form.Label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <Form.Control {...field} isInvalid={!!errors.color} />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.color?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="formSize" className="mb-3">
            <Form.Label className={styles.formLabel}>Kích thước</Form.Label>
            <Controller
              name="size"
              control={control}
              render={({ field }) => (
                <Form.Control {...field} isInvalid={!!errors.size} />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.size?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group controlId="formIsNatural" className="mb-3">
            <Form.Check
              type="switch"
              label="Tự nhiên"
              {...register('isNatural')}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="formIsAvailable" className="mb-3">
            <Form.Check
              type="switch"
              label="Còn bán"
              {...register('isAvailable')}
            />
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" type="submit">
        {editMode ? 'Cập nhật' : 'Thêm mới'}
      </Button>
    </form>
  );
}
