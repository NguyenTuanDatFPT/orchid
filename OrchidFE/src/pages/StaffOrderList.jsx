import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/userService';
import { Link, Navigate } from 'react-router-dom';
import { authUtils } from '../utils/authUtils';

export default function StaffOrderList() {
  // Kiểm tra role, chỉ cho phép ADMIN/STAFF
  if (!authUtils.canManageOrders()) {
    return <Navigate to="/" replace />;
  }

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = authUtils.getCurrentUser();

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError('');
      try {
        const data = await orderAPI.getAllOrdersAdmin();
        setOrders(data.payload?.content || []);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải danh sách đơn hàng');
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <div style={{maxWidth: 1000, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <h2 style={{margin: 0}}>Quản lý đơn hàng</h2>
        <span style={{color: '#b83260', fontWeight: 600, fontSize: 16}}>Role: {currentUser?.role}</span>
      </div>
      {loading && <div>Đang tải...</div>}
      {error && <div style={{color: 'red'}}>{error}</div>}
      {!loading && !error && (
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: '#f5f6fa'}}>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={6}>Không có đơn hàng nào.</td></tr>
            )}
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id && order.id.length > 9 ? order.id.slice(0, 9) + '...' : order.id}</td>
                <td>{order.username}</td>
                <td>{order.createAt ? new Date(order.createAt).toLocaleString() : ''}</td>
                <td>{order.totalAmount?.toLocaleString('vi-VN')} đ</td>
                <td>{order.status}</td>
                <td><Link to={`/admin/orders/${order.id}`}>Xem</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
