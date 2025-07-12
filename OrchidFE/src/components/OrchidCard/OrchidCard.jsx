import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/userService';
import toast from 'react-hot-toast';

import OrderInfoModal from '../OrderInfoModal';

import styles from './OrchidCard.module.css';

function OrchidCard({ item, onAddToCart }) {
  const navigate = useNavigate();
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleBuyNow = () => {
    setShowOrderModal(true);
  };

  const handleOrderConfirm = async ({ address, phone, notes }) => {
    setLoadingOrder(true);
    try {
      await orderAPI.createOrder({
        items: [
          {
            orchidId: item.id,
            quantity: 1
          }
        ],
        shippingAddress: address,
        phoneNumber: phone,
        notes
      });
      toast.success('Đặt hàng thành công!', { duration: 3000 });
      setShowOrderModal(false);
      navigate('/my-orders');
    } catch (err) {
      toast.error('Đặt hàng thất bại!', { duration: 3000 });
    }
    setLoadingOrder(false);
  };

  return (
    <>
      <Card className={`shadow-sm h-100 border-0 ${styles.orchidCard}`}>
        <div className={styles.orchidImgWrapper}>
          <Card.Img
            variant="top"
            src={item.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={item.name}
            className={styles.cardImg}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          {/* Status badges */}
          <div className={styles.badgeContainer}>
            {item.isNatural && (
              <Badge bg="success" className={styles.naturalBadge}>
                Tự nhiên
              </Badge>
            )}
            {!item.isAvailable && (
              <Badge bg="danger" className={styles.unavailableBadge}>
                Hết hàng
              </Badge>
            )}
          </div>
        </div>
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Title className={styles.cardTitle}>{item.name}</Card.Title>
            <Card.Text className={styles.cardDescription}>
              {item.description && item.description.length > 100 
                ? item.description.substring(0, 100) + '...' 
                : item.description
              }
            </Card.Text>
            <div className={styles.priceContainer}>
              <span className={styles.price}>{formatPrice(item.price)}</span>
              {item.stock && (
                <small className="text-muted">Còn lại: {item.stock}</small>
              )}
            </div>
          </div>
          <div className="d-flex justify-content-center gap-3 mt-auto">
            <Button 
              as={Link}
              to={`/detail/${item.id}`}
              className={styles.cardBtn + ' ' + styles.cardBtnOutline} 
              variant="outline-primary" 
              size="sm"
            >
              Chi tiết
            </Button>
            <Button
              className={styles.cardBtn + ' ' + styles.cardBtnPrimary}
              variant="primary"
              size="sm"
              onClick={() => onAddToCart(item)}
              disabled={!item.isAvailable || item.stock <= 0}
            >
              <i className="bi bi-cart-plus"></i> Thêm vào giỏ
            </Button>
            <Button
              className={styles.cardBtn + ' ' + styles.cardBtnPrimary}
              variant="success"
              size="sm"
              onClick={handleBuyNow}
              disabled={!item.isAvailable || item.stock <= 0}
            >
              <i className="bi bi-lightning-charge"></i> Mua ngay
            </Button>
          </div>
        </Card.Body>
      </Card>
      <OrderInfoModal
        show={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onConfirm={handleOrderConfirm}
        loading={loadingOrder}
      />
    </>
  );
}

export default OrchidCard;
