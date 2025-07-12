import React, { useState } from 'react';
import PropTypes from 'prop-types';

function OrderInfoModal({ show, onClose, onConfirm, loading }) {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng!');
      return;
    }
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại!');
      return;
    }
    if (!/^\d{10,11}$/.test(phone.trim())) {
      setError('Số điện thoại phải có 10-11 chữ số!');
      return;
    }
    setError('');
    onConfirm({ address, phone, notes });
  };

  if (!show) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 4px 24px #e0c3fc55', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h4 style={{ color: '#b83260', marginBottom: 8 }}>Thông tin đặt hàng</h4>
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Địa chỉ giao hàng" style={{ padding: 8, borderRadius: 6, border: '1px solid #eee' }} required maxLength={500} />
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Số điện thoại (10-11 số)" style={{ padding: 8, borderRadius: 6, border: '1px solid #eee' }} required maxLength={11} />
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ghi chú (tùy chọn)" style={{ padding: 8, borderRadius: 6, border: '1px solid #eee', minHeight: 60 }} maxLength={500} />
        {error && <div style={{ color: '#d9534f', fontWeight: 500 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" style={{ background: '#b83260', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }} disabled={loading}>Xác nhận</button>
          <button type="button" onClick={onClose} style={{ background: '#eee', color: '#b83260', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 600, cursor: 'pointer' }} disabled={loading}>Hủy</button>
        </div>
      </form>
    </div>
  );
}

OrderInfoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default OrderInfoModal;
