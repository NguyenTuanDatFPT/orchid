import { Navigate } from 'react-router-dom';
import { tokenUtils } from '../utils/tokenUtils';
import { authUtils } from '../utils/authUtils';

// Protected Route Component - requires authentication
export const ProtectedRoute = ({ children }) => {
  if (!tokenUtils.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Role-based Route Protection
export const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!tokenUtils.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !authUtils.hasAnyRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin Only Route
export const AdminRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={['ADMIN']}>
      {children}
    </RoleProtectedRoute>
  );
};

// Staff and Admin Route
export const StaffRoute = ({ children }) => {
  return (
    <RoleProtectedRoute allowedRoles={['ADMIN', 'STAFF']}>
      {children}
    </RoleProtectedRoute>
  );
};
