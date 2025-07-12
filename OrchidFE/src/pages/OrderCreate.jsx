import React, { useState } from 'react';
import { orchidAPI, orderAPI } from '../services/userService';
import './OrderCreate.css';

export default function OrderCreate() {
  const [orchidId, setOrchidId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [orchids, setOrchids] = useState([]);

  React.useEffect(() => {
    async function fetchOrchids() {
      try {
        const data = await orchidAPI.getOrchids();
        setOrchids(data.content || data);
      } catch (err) {
        setOrchids([]);
      }
    }
    fetchOrchids();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await orderAPI.createOrder({
        items: [{ orchidId, quantity }],
        shippingInfo: { address },
      });
      setSuccess('Đặt hàng thành công!');
      setOrchidId('');
      setQuantity(1);
      setAddress('');
    } catch (err) {
      setError(err.message || 'Đặt hàng thất bại!');
    }
    setLoading(false);
  };

  return (
    <div className="order-create-container">
      <h2>Đặt hàng mới</h2>
      <form className="order-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Chọn hoa lan:</label>
          <select value={orchidId} onChange={e => setOrchidId(e.target.value)} required>
            <option value="">-- Chọn hoa lan --</option>
            {orchids.map(orchid => (
              <option key={orchid.id} value={orchid.id}>{orchid.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Số lượng:</label>
          <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required />
        </div>
        <div className="form-group">
          <label>Địa chỉ giao hàng:</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Đang đặt...' : 'Đặt hàng'}</button>
      </form>
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
