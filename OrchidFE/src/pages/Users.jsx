import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/userService';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/esm/Container';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';

const ROLE_OPTIONS = ['USER', 'STAFF', 'ADMIN'];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userAPI.getAllUsers();
      setUsers(res.payload?.content || res.content || []);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách người dùng');
    }
    setLoading(false);
  };

  const handleChangeRole = async (userId, newRole) => {
    setUpdating(userId + '-role');
    try {
      await userAPI.updateUserRole(userId, newRole);
      toast.success('Cập nhật role thành công!', { duration: 3000 });
      fetchUsers();
    } catch (err) {
      toast.error('Cập nhật role thất bại!', { duration: 3000 });
    }
    setUpdating('');
  };

  const handleDeactivate = async (userId) => {
    setUpdating(userId + '-deactivate');
    try {
      await userAPI.deactivateUser(userId);
      toast.success('Đã khóa tài khoản!', { duration: 3000 });
      fetchUsers();
    } catch (err) {
      toast.error('Khóa tài khoản thất bại!', { duration: 3000 });
    }
    setUpdating('');
  };

  const handleActivate = async (userId) => {
    setUpdating(userId + '-activate');
    try {
      await userAPI.activateUser(userId);
      toast.success('Đã mở khóa tài khoản!', { duration: 3000 });
      fetchUsers();
    } catch (err) {
      toast.error('Mở khóa tài khoản thất bại!', { duration: 3000 });
    }
    setUpdating('');
  };

  return (
    <Container style={{ maxWidth: 1000, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32 }}>
      <Toaster />
      <h2 style={{ marginBottom: 24 }}>Quản lý người dùng</h2>
      {loading && <div>Đang tải...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Role</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={7}>Không có người dùng nào.</td></tr>
            )}
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>
                  <DropdownButton
                    id={`dropdown-role-${user.id}`}
                    title={user.role}
                    variant="outline-secondary"
                    size="sm"
                    disabled={updating === user.id + '-role'}
                  >
                    {ROLE_OPTIONS.filter(r => r !== user.role).map(role => (
                      <Dropdown.Item key={role} onClick={() => handleChangeRole(user.id, role)}>
                        {role}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </td>
                <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                <td>{user.createAt ? new Date(user.createAt).toLocaleString() : ''}</td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={!user.isActive || updating === user.id + '-deactivate'}
                    onClick={() => handleDeactivate(user.id)}
                  >
                    Khóa
                  </Button>
                  {' '}
                  <Button
                    variant="outline-success"
                    size="sm"
                    disabled={user.isActive || updating === user.id + '-activate'}
                    onClick={() => handleActivate(user.id)}
                  >
                    Mở khóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
