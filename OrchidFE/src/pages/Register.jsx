import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Register.module.css';
import logo from '../assets/images.png';
import { userAPI } from '../services/userService';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userAPI.createUser({
        username: formData.username,
        password: formData.password
      });

      // Hiển thị thông báo thành công
      toast.success(response.message || 'Đăng ký thành công!', { duration: 3000 });
      
      // Reset form
      setFormData({
        username: '',
        password: ''
      });

      // Chuyển hướng đến trang đăng nhập sau 1.5 giây
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error) {
      // Hiển thị thông báo lỗi
      const errorMessage = error.message || 'Có lỗi xảy ra khi đăng ký!';
      toast.error(errorMessage, { duration: 3000 });
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerBg}>
      <Container className="d-flex justify-content-center align-items-center">
        <Row>
          <Col>
            <Card className={styles.registerCard}>
              <Card.Body>
                <img src={logo} alt="Orchid Logo" className={styles.registerLogo} />
                <Card.Title className={styles.registerTitle}>Đăng ký</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Tên người dùng</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="username"
                      placeholder="Nhập tên người dùng" 
                      value={formData.username}
                      onChange={handleInputChange}
                      required 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control 
                      type="password" 
                      name="password"
                      placeholder="Nhập mật khẩu" 
                      value={formData.password}
                      onChange={handleInputChange}
                      required 
                    />
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className={`w-100 ${styles.registerBtn}`}
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                  </Button>
                </Form>
                <div className="mt-3 text-center">
                  <span>Bạn đã có tài khoản? </span>
                  <Link to="/login" className={styles.registerLink}>Đăng nhập</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}