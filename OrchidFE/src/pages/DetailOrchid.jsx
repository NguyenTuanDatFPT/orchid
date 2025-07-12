import React from 'react';
import { useParams } from 'react-router';
import { Breadcrumb, Card, Badge, Image, Row, Col } from 'react-bootstrap';
import { orchidAPI } from '../services/userService';

export default function DetailOrchid() {
  const [orchid, setOrchid] = React.useState(null);
  const { id } = useParams();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await orchidAPI.getOrchidById(id);
        setOrchid(res.payload || res.content || res);
      } catch (error) {
        setOrchid(null);
      }
    }
    fetchData();
  }, [id]);

  if (!orchid) {
    return <div className="container py-5">Không tìm thấy hoa lan.</div>;
  }

  return (
    <div className="container py-5">
      <Row>
        <Col md={12} className="d-flex flex-column align-items-center mb-4">
          <Image
            src={orchid.imageUrl}
            alt={orchid.name || 'Loading...'}
            style={{ maxWidth: 420, maxHeight: 320, objectFit: 'cover', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
            className="mb-3"
          />
        </Col>
      </Row>
      <Row>
        <Col md={8} className="p-3">
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>{orchid.name || 'Loading...'}</Breadcrumb.Item>
          </Breadcrumb>

          <Badge className="custom-chip my-3">
            {orchid.name || 'Loading...'}
          </Badge>

          <Card className="mt-3">
            <Card.Header>
              <p className="text-primary fs-5">{orchid.description || 'Loading...'}</p>
            </Card.Header>
            <hr />
            <Card.Body>
              <div className="mb-2">
                <b>Giá:</b> {orchid.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </div>
              <div className="mb-2">
                <b>Tồn kho:</b> {orchid.stock}
              </div>
              <div className="mb-2">
                <b>Xuất xứ:</b> {orchid.origin}
              </div>
              <div className="mb-2">
                <b>Màu sắc:</b> {orchid.color}
              </div>
              <div className="mb-2">
                <b>Kích thước:</b> {orchid.size}
              </div>
              <div className="mb-2">
                <b>Trạng thái:</b> {orchid.isAvailable ? 'Còn bán' : 'Hết hàng'}
              </div>
              <div className="mb-2">
                <b>Loại:</b> {orchid.isNatural ? 'Tự nhiên' : 'Nhân tạo'}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="p-3 d-none d-md-block">
          {/* Có thể thêm banner, quảng cáo, hoặc thông tin phụ ở đây nếu muốn */}
        </Col>
      </Row>
    </div>
  );
}