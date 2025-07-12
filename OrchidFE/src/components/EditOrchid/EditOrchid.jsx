import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Col, Row } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router';
import styles from './EditOrchid.module.css';
import OrchidForm from './OrchidForm';
import OrchidImagePreview from './OrchidImagePreview';
import { orchidAPI } from '../../services/userService';

export default function EditOrchid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orchid, setOrchid] = useState(null);
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();

  useEffect(() => {
    async function fetchOrchid() {
      try {
        const res = await orchidAPI.getOrchidById(id);
        setOrchid(res.payload || res.content || res);
        // Map fields to form
        setValue('name', res.payload?.name || res.content?.name || res.name || '');
        setValue('description', res.payload?.description || res.content?.description || res.description || '');
        setValue('price', res.payload?.price || res.content?.price || res.price || '');
        setValue('stock', res.payload?.stock || res.content?.stock || res.stock || '');
        setValue('imageUrl', res.payload?.imageUrl || res.content?.imageUrl || res.imageUrl || '');
        setValue('origin', res.payload?.origin || res.content?.origin || res.origin || '');
        setValue('color', res.payload?.color || res.content?.color || res.color || '');
        setValue('size', res.payload?.size || res.content?.size || res.size || '');
        setValue('isNatural', res.payload?.isNatural ?? res.content?.isNatural ?? res.isNatural ?? false);
        setValue('isAvailable', res.payload?.isAvailable ?? res.content?.isAvailable ?? res.isAvailable ?? true);
      } catch (error) {
        toast.error('Không lấy được dữ liệu hoa lan!', { duration: 3000 });
      }
    }
    fetchOrchid();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    // Chỉ gửi đúng các trường backend yêu cầu
    const payload = {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      imageUrl: data.imageUrl,
      origin: data.origin,
      color: data.color,
      size: data.size,
      isNatural: data.isNatural,
      isAvailable: data.isAvailable
    };
    try {
      await orchidAPI.updateOrchid(id, payload);
      toast.success('Cập nhật hoa lan thành công!', { duration: 3000 });
      setTimeout(() => navigate('/manage'), 1200);
    } catch (error) {
      toast.error('Cập nhật hoa lan thất bại!', { duration: 3000 });
    }
  };

  return (
    <Container className={styles.container}>
      <Toaster />
      <Row>
        <p className={`lead ${styles.leadTitle}`}>Sửa hoa lan: {orchid?.name}</p>
        <hr />
        <Col md={8}>
          <OrchidForm
            control={control}
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            editMode={true}
          />
        </Col>
        <Col md={4}>
          <OrchidImagePreview src={orchid?.imageUrl} />
        </Col>
      </Row>
    </Container>
  );
}
