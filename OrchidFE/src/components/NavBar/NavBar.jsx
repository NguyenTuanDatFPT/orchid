import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import logo from '../../assets/images.png';
import styles from './NavBar.module.css';
import { tokenUtils } from '../../utils/tokenUtils';
import { authUtils, ROLES } from '../../utils/authUtils';
import { orderAPI } from '../../services/userService';
import OrderInfoModal from '../OrderInfoModal';

function NavBar() {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [addressInput, setAddressInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [showOrderError, setShowOrderError] = useState('');
  const [showOrderSuccess, setShowOrderSuccess] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderModalLoading, setOrderModalLoading] = useState(false);
  const cartDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get current user info
  const currentUser = authUtils.getCurrentUser();
  const isAuthenticated = tokenUtils.isAuthenticated();
  const isAdmin = authUtils.isAdmin();
  const isStaff = authUtils.isStaff();
  const isUser = authUtils.isUser();

  const handleLogout = () => {
    tokenUtils.clearTokens();
    toast.success('Đăng xuất thành công!', { duration: 3000 });
    navigate('/');
  };

  const handleCartClick = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
    setShowCart((prev) => !prev);
    // Reset checked state when open
    setCheckedItems({});
  };

  const handleCloseCart = () => setShowCart(false);

  const handleCheck = (key) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteSelected = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const newCart = cart.filter((item, idx) => !checkedItems[item.id + '-' + idx]);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCartItems(newCart);
    setCheckedItems({});
  };

  const handleBuySelected = () => {
    const selected = cartItems.filter((item, idx) => checkedItems[item.id + '-' + idx]);
    if (selected.length === 0) {
      setShowOrderError('Vui lòng chọn sản phẩm để mua!');
      setTimeout(() => setShowOrderError(''), 2000);
      return;
    }
    setShowOrderForm(true);
    setShowOrderError('');
    setShowOrderSuccess('');
  };

  const handleOrderModalConfirm = async ({ address, phone, notes }) => {
    const selected = cartItems.filter((item, idx) => checkedItems[item.id + '-' + idx]);
    if (selected.length === 0) {
      setShowOrderError('Vui lòng chọn sản phẩm để mua!');
      setShowOrderForm(false);
      return;
    }
    setOrderModalLoading(true);
    try {
      await orderAPI.createOrder({
        items: selected.map(item => ({ orchidId: item.id, quantity: item.quantity || 1 })),
        shippingAddress: address,
        phoneNumber: phone,
        notes
      });
      setShowOrderSuccess('Đặt hàng thành công!');
      // Xóa các sản phẩm đã mua khỏi giỏ
      const newCart = cartItems.filter((item, idx) => !checkedItems[item.id + '-' + idx]);
      localStorage.setItem('cart', JSON.stringify(newCart));
      setCartItems(newCart);
      setCheckedItems({});
      setShowCart(false);
      setShowOrderForm(false);
    } catch (err) {
      setShowOrderError(err?.message || 'Đặt hàng thất bại!');
      setTimeout(() => setShowOrderError(''), 3000);
    }
    setOrderModalLoading(false);
  };

  useEffect(() => {
    if (!showCart) return;
    function handleClickOutside(event) {
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setShowCart(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCart]);

  return (
    <Navbar expand="lg" className={`${styles.bgBodyTertiary} shadow-sm py-2`} style={{ minHeight: 70 }}>
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" className={({ isActive }) => `d-flex align-items-center gap-2 ${styles.navbarBrand} ${isActive ? styles.navLinkActive : ''}`} end>
          <img
            src={logo}
            alt="Orchids Shop Logo"
            width="44"
            height="44"
            style={{ objectFit: 'contain', borderRadius: '50%', background: '#f6c1c7', boxShadow: '0 2px 8px #e0c3fc55', padding: '0.2rem' }}
          />
          <span className="fw-bold fs-4" style={{lineHeight: '44px', height: '44px', display: 'inline-block', verticalAlign: 'middle', paddingBottom: 4}}>Orchids Shop</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="align-items-center gap-2" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {/* ĐẨY MENU CHÍNH SANG PHẢI */}
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 16, justifyContent: 'end' }}>
                <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}` || undefined}>
                  {({ isActive }) => (
                    <>
                      <i className={`bi bi-house-door ${styles.homeIcon} ${styles.iconTransition} ${isActive ? styles.iconActive : ''}`}></i>
                      <span className={styles.homeText}>Trang chủ</span>
                    </>
                  )}
                </NavLink>

                {/* Admin và Staff có thể quản lý hoa lan */}
                {(isAdmin || isStaff) && (
                  <NavLink to="/manage" className={styles.navLink}>
                    <i className="bi bi-flower1"></i> Quản lý hoa
                  </NavLink>
                )}

                {/* Admin có thể quản lý users */}
                {isAdmin && (
                  <NavLink to="/users" className={styles.navLink}>
                    <i className="bi bi-people"></i> Quản lý người dùng
                  </NavLink>
                )}

                {/* Admin và Staff có thể xem orders */}
                {(isAdmin || isStaff) && (
                  <NavLink to="/orders" className={styles.navLink}>
                    <i className="bi bi-box"></i> Quản lý đơn hàng
                  </NavLink>
                )}

                {/* User đã đăng nhập có thể xem orders của mình */}
                {isAuthenticated && isUser && (
                  <NavLink to="/my-orders" className={styles.navLink}>
                    <i className="bi bi-box"></i> Đơn hàng của tôi
                  </NavLink>
                )}

                {/* Giỏ hàng chỉ cho USER */}
                {isAuthenticated && isUser && (
                  <span style={{ position: 'relative' }}>
                    <button type="button" className={styles.navLink} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={handleCartClick}>
                      <i className="bi bi-cart3"></i> Giỏ hàng
                    </button>
                    {/* ...existing cart dropdown code... */}
                    {showCart && (
                      <div ref={cartDropdownRef} style={{ position: 'absolute', right: 0, top: '120%', zIndex: 1000, minWidth: 300, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px #e0c3fc55', padding: 12 }}>
                        <div style={{ fontWeight: 700, color: '#b83260', marginBottom: 8 }}>Sản phẩm trong giỏ</div>
                        {cartItems.length > 0 && (
                          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                            <button onClick={handleBuySelected} style={{ border: 'none', background: '#b83260', color: '#fff', borderRadius: 8, padding: '4px 16px', fontWeight: 600, cursor: 'pointer' }}>Mua</button>
                            <button onClick={handleDeleteSelected} style={{ border: 'none', background: '#ffe0eb', color: '#b83260', borderRadius: 8, padding: '4px 16px', fontWeight: 600, cursor: 'pointer' }}>Xóa</button>
                          </div>
                        )}
                        {cartItems.length === 0 ? (
                          <div style={{ color: '#888', fontStyle: 'italic' }}>Chưa có sản phẩm nào</div>
                        ) : (
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: 220, overflowY: 'auto' }}>
                            {cartItems.map((item, idx) => {
                              const key = item.id + '-' + idx;
                              return (
                                <li key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                  <input type="checkbox" checked={!!checkedItems[key]} onChange={() => handleCheck(key)} style={{ accentColor: '#b83260' }} />
                                  <img 
                                    src={item.image || logo} 
                                    alt={item.orchidName} 
                                    style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', boxShadow: '0 1px 4px #e0c3fc33' }} 
                                    onError={e => { e.target.onerror = null; e.target.src = logo; }}
                                  />
                                  <span style={{ flex: 1, fontWeight: 500 }}>{item.orchidName}</span>
                                  <span style={{ color: '#b83260', fontWeight: 600, marginRight: 6 }}>x{item.quantity}</span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                        <button onClick={handleCloseCart} style={{ marginTop: 8, border: 'none', background: '#f6c1c7', color: '#b83260', borderRadius: 8, padding: '4px 16px', fontWeight: 600, cursor: 'pointer', float: 'right' }}>Đóng</button>
                      </div>
                    )}
                  </span>
                )}
              </div>
              {/* Role và logout gọn bên phải */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {isAuthenticated ? (
                  <>
                    <span className={`${styles.navLink} text-muted`} style={{ fontWeight: 700, color: isAdmin ? '#b83260' : isStaff ? '#0275d8' : '#333' }}>
                      <i className="bi bi-person-circle"></i> {currentUser?.role}
                    </span>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={handleLogout}
                      className="d-flex align-items-center gap-1"
                    >
                      <i className="bi bi-box-arrow-right"></i> Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className={styles.navLink}>
                      <i className="bi bi-box-arrow-in-right"></i> Đăng nhập
                    </NavLink>
                    <NavLink to="/register" className={styles.navLink}>
                      <i className="bi bi-person-plus"></i> Đăng ký
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Modal nhập địa chỉ giao hàng */}
      <OrderInfoModal
        show={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        onConfirm={handleOrderModalConfirm}
        loading={orderModalLoading}
      />
      {/* Thông báo thành công */}
      {showOrderSuccess && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#5cb85c', color: '#fff', padding: '12px 24px', borderRadius: 8, zIndex: 3000, fontWeight: 600 }}>{showOrderSuccess}</div>
      )}
      {/* Thông báo lỗi */}
      {showOrderError && !showOrderForm && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#d9534f', color: '#fff', padding: '12px 24px', borderRadius: 8, zIndex: 3000, fontWeight: 600 }}>{showOrderError}</div>
      )}
    </Navbar>
  );
}

export default NavBar;