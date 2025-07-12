import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Login.module.css';
import logo from '../assets/images.png';
import { authAPI } from '../services/userService';
import { tokenUtils } from '../utils/tokenUtils';

export default function Login() {
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
      const response = await authAPI.login({
        username: formData.username,
        password: formData.password
      });

      // Check if login is successful (code 200 and has jwtToken)
      if (response.code === 200 && response.payload && response.payload.jwtToken) {
        // Save token to localStorage (using the actual response format)
        tokenUtils.saveTokens(
          response.payload.jwtToken,
          null, // No refresh token in this response
          3600 // Default 1 hour expiration
        );

        // Save additional user info
        localStorage.setItem('userRole', response.payload.role);
        localStorage.setItem('isAuthenticated', response.payload.isAuthenticate);

        // Show success message
        toast.success('Đăng nhập thành công!', { duration: 3000 });

        // Reset form
        setFormData({
          username: '',
          password: ''
        });

        // Redirect to home page after successful login
        setTimeout(() => {
          navigate('/');
        }, 1500);

      } else {
        // Handle case where code is not 200 or missing jwtToken
        const errorMessage = response.message || 'Phản hồi từ server không hợp lệ!';
        toast.error(errorMessage, { duration: 3000 });
      }

    } catch (error) {
      // Show error message
      const errorMessage = error.message || error.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng!';
      toast.error(errorMessage, { duration: 3000 });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginBg}>
      <Container className="d-flex justify-content-center align-items-center">
        <Row>
          <Col>
            <Card className={styles.loginCard}>
              <Card.Body>
                <img src={logo} alt="Orchid Logo" className={styles.loginLogo} />
                <Card.Title className={styles.loginTitle}>Đăng nhập</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicUsername">
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
                  <Form.Group className="mb-3" controlId="formBasicPassword">
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
                    className={`w-100 ${styles.loginBtn}`}
                    disabled={loading}
                  >
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </Form>
                <div className="mt-3 text-center">
                  <span>Bạn chưa có tài khoản? </span>
                  <Link to="/register" className={styles.loginLink}>
                    Đăng ký
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}