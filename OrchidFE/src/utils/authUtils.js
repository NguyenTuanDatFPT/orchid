import { tokenUtils } from './tokenUtils';

// Role constants
export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF', 
  USER: 'USER'
};

// Permission utilities
export const authUtils = {
  // Check if user has specific role
  hasRole: (requiredRole) => {
    const userRole = tokenUtils.getUserRole();
    return userRole === requiredRole;
  },

  // Check if user has any of the required roles
  hasAnyRole: (requiredRoles) => {
    const userRole = tokenUtils.getUserRole();
    return requiredRoles.includes(userRole);
  },

  // Check if user is admin
  isAdmin: () => {
    return authUtils.hasRole(ROLES.ADMIN);
  },

  // Check if user is staff
  isStaff: () => {
    return authUtils.hasRole(ROLES.STAFF);
  },

  // Check if user is regular user
  isUser: () => {
    return authUtils.hasRole(ROLES.USER);
  },

  // Check if user can manage orchids (admin or staff)
  canManageOrchids: () => {
    return authUtils.hasAnyRole([ROLES.ADMIN, ROLES.STAFF]);
  },

  // Check if user can manage users (admin only)
  canManageUsers: () => {
    return authUtils.isAdmin();
  },

  // Check if user can manage orders (admin or staff)
  canManageOrders: () => {
    return authUtils.hasAnyRole([ROLES.ADMIN, ROLES.STAFF]);
  },

  // Get current user info
  getCurrentUser: () => {
    if (!tokenUtils.isAuthenticated()) {
      return null;
    }

    return {
      role: tokenUtils.getUserRole(),
      isAuthenticated: tokenUtils.getAuthStatus(),
      token: tokenUtils.getAccessToken()
    };
  }
};
