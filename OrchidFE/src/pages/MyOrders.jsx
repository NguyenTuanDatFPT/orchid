import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/userService';
import { Link } from 'react-router-dom';
import './MyOrders.css';

const statusColors = {
  PENDING: '#f0ad4e',
  CONFIRMED: '#5bc0de',
  PROCESSING: '#0275d8',
  SHIPPED: '#5cb85c',
  DELIVERED: '#428bca',
  CANCELLED: '#d9534f',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError('');
      try {
        const data = await orderAPI.getMyOrders();
        console.log('API getMyOrders trả về:', data); // Thêm log để debug dữ liệu trả về
        setOrders(data.payload?.content || []);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải đơn hàng');
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <div className="my-orders-container">
      <h2>Lịch sử đơn hàng của bạn</h2>
      {loading && <div className="loading">Đang tải...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={5}>Bạn chưa có đơn hàng nào.</td></tr>
            )}
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id && order.id.length > 9 ? order.id.slice(0, 9) + '...' : order.id}</td>
                <td>{order.createAt ? new Date(order.createAt).toLocaleString() : ''}</td>
                <td>{order.totalAmount?.toLocaleString('vi-VN')} đ</td>
                <td>
                  <span style={{color: statusColors[order.status] || '#333', fontWeight: 600}}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <Link to={`/orders/${order.id}`}>Xem</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
