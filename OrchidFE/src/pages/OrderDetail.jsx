import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/userService';
import './OrderDetail.css';

const statusColors = {
  PENDING: '#f0ad4e',
  CONFIRMED: '#5bc0de',
  PROCESSING: '#0275d8',
  SHIPPED: '#5cb85c',
  DELIVERED: '#428bca',
  CANCELLED: '#d9534f',
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError('');
      try {
        const data = await orderAPI.getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải chi tiết đơn hàng');
      }
      setLoading(false);
    }
    fetchOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) return;
    setCanceling(true);
    try {
      await orderAPI.cancelOrder(id);
      alert('Đã hủy đơn hàng thành công!');
      navigate('/my-orders');
    } catch (err) {
      alert(err.message || 'Hủy đơn hàng thất bại!');
    }
    setCanceling(false);
  };

  if (loading) return <div className="order-detail-container"><div className="loading">Đang tải...</div></div>;
  if (error) return <div className="order-detail-container"><div className="error">{error}</div></div>;
  if (!order) return null;

  return (
    <div className="order-detail-container">
      <h2>Chi tiết đơn hàng #{order.id}</h2>
      <div className="order-info">
        <div><b>Ngày đặt:</b> {new Date(order.createdAt || order.date).toLocaleString()}</div>
        <div><b>Trạng thái:</b> <span style={{color: statusColors[order.status] || '#333', fontWeight: 600}}>{order.status}</span></div>
        <div><b>Tổng tiền:</b> {order.totalAmount?.toLocaleString('vi-VN')} đ</div>
        <div><b>Địa chỉ giao hàng:</b> {order.shippingInfo?.address || 'N/A'}</div>
      </div>
      <h3>Danh sách sản phẩm</h3>
      <table className="order-items-table">
        <thead>
          <tr>
            <th>Tên hoa lan</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map(item => (
            <tr key={item.id}>
              <td>{item.orchid?.name || 'Hoa lan'}</td>
              <td>{item.quantity}</td>
              <td>{item.price?.toLocaleString('vi-VN')} đ</td>
              <td>{(item.price * item.quantity)?.toLocaleString('vi-VN')} đ</td>
            </tr>
          ))}
        </tbody>
      </table>
      {order.status === 'PENDING' && (
        <button className="cancel-btn" onClick={handleCancel} disabled={canceling}>
          {canceling ? 'Đang hủy...' : 'Hủy đơn hàng'}
        </button>
      )}
      <button className="back-btn" onClick={() => navigate('/my-orders')}>Quay lại danh sách</button>
    </div>
  );
}
