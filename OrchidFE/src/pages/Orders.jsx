import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/userService';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/esm/Container';
import { Button, Dropdown, DropdownButton, Badge } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-bootstrap/Modal';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await orderAPI.getAllOrders();
      setOrders(res.payload?.content || res.content || []);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách đơn hàng');
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId, status) => {
    setUpdating(orderId + '-status');
    try {
      await orderAPI.updateOrderStatus(orderId, status);
      toast.success('Cập nhật trạng thái thành công!', { duration: 3000 });
      fetchOrders();
    } catch (err) {
      toast.error('Cập nhật trạng thái thất bại!', { duration: 3000 });
    }
    setUpdating('');
  };

  const handleCancel = async (orderId) => {
    setUpdating(orderId + '-cancel');
    try {
      await orderAPI.cancelOrder(orderId);
      toast.success('Đã hủy đơn hàng!', { duration: 3000 });
      fetchOrders();
    } catch (err) {
      toast.error('Hủy đơn hàng thất bại!', { duration: 3000 });
    }
    setUpdating('');
  };

  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };
  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedOrder(null);
  };

  return (
    <Container style={{ maxWidth: 1200, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <Toaster />
      <h2 style={{ marginBottom: 24 }}>Quản lý đơn hàng</h2>
      {loading && <div>Đang tải...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Người đặt</th>
              <th>Địa chỉ</th>
              <th>SĐT</th>
              <th>Ghi chú</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={9}>Không có đơn hàng nào.</td></tr>
            )}
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.username || order.user?.username || ''}</td>
                <td>{order.shippingAddress}</td>
                <td>{order.phoneNumber}</td>
                <td>{order.notes}</td>
                <td>{order.createAt ? new Date(order.createAt).toLocaleString() : ''}</td>
                <td>
                  <Badge bg={order.status === 'COMPLETED' ? 'success' : order.status === 'CANCELLED' ? 'danger' : 'warning'}>
                    {order.status}
                  </Badge>
                </td>
                <td>{order.totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || ''}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      variant="outline-info"
                      size="sm"
                      style={{ minWidth: 110, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => handleShowDetail(order)}
                    >
                      Xem chi tiết
                    </Button>
                    <DropdownButton
                      id={`dropdown-status-${order.id}`}
                      title="Cập nhật trạng thái"
                      variant="outline-secondary"
                      size="sm"
                      style={{ minWidth: 150, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      disabled={updating === order.id + '-status'}
                    >
                      {STATUS_OPTIONS.filter(s => s !== order.status).map(status => (
                        <Dropdown.Item key={status} onClick={() => handleUpdateStatus(order.id, status)}>
                          {status}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      style={{ minWidth: 90, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      disabled={order.status === 'CANCELLED' || updating === order.id + '-cancel'}
                      onClick={() => handleCancel(order.id)}
                    >
                      Hủy đơn
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {/* Modal chi tiết đơn hàng */}
      <Modal show={showDetail} onHide={handleCloseDetail} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <div><b>Mã đơn:</b> {selectedOrder.id}</div>
              <div><b>Người đặt:</b> {selectedOrder.username}</div>
              <div><b>Địa chỉ:</b> {selectedOrder.shippingAddress}</div>
              <div><b>SĐT:</b> {selectedOrder.phoneNumber}</div>
              <div><b>Ghi chú:</b> {selectedOrder.notes}</div>
              <div><b>Ngày tạo:</b> {selectedOrder.createAt ? new Date(selectedOrder.createAt).toLocaleString() : ''}</div>
              <div><b>Trạng thái:</b> {selectedOrder.status}</div>
              <div><b>Tổng tiền:</b> {selectedOrder.totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
              <hr />
              <h5>Danh sách sản phẩm</h5>
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên hoa lan</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.orderItems?.map(item => (
                    <tr key={item.id}>
                      <td><img src={item.orchidImageUrl} alt="orchid" width={48} /></td>
                      <td>{item.orchidName}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unitPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                      <td>{item.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetail}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
