// Token management utilities
export const tokenUtils = {
  // Save tokens to localStorage
  saveTokens: (accessToken, refreshToken = null, expiresIn = 3600) => {
    localStorage.setItem('accessToken', accessToken);
    
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    // Calculate expiration time and save it
    const expirationTime = new Date().getTime() + (expiresIn * 1000);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
  },

  // Get access token from localStorage
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  // Get refresh token from localStorage
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  // Check if token is expired
  isTokenExpired: () => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (!expirationTime) return true;
    
    return new Date().getTime() > parseInt(expirationTime);
  },

  // Remove all tokens from localStorage
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenUtils.getAccessToken();
    const isAuth = localStorage.getItem('isAuthenticated');
    return token && !tokenUtils.isTokenExpired() && isAuth === 'true';
  },

  // Get user role
  getUserRole: () => {
    return localStorage.getItem('userRole');
  },

  // Get authentication status
  getAuthStatus: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
};
