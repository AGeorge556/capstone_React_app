// Configuration for API and other global settings
const API_URL = 'http://localhost:8181'; // Replace with your actual API URL in production

// Set to true to use mock API endpoints when the server is unavailable
const USE_MOCK_API = true;

// Check server connectivity
const checkServerConnectivity = async () => {
  if (!USE_MOCK_API) {
    try {
      const response = await fetch(`${API_URL}/health`, { 
        method: 'HEAD',
        cache: 'no-cache',
        headers: { 'Cache-Control': 'no-cache' }
      });
      return response.ok;
    } catch (error) {
      console.warn('Server connectivity check failed:', error);
      return false;
    }
  }
  return false;
};

export { API_URL, USE_MOCK_API, checkServerConnectivity };

// API endpoints for authentication
export const AUTH_ENDPOINTS = {
  // Real endpoints
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  USER: '/api/auth/user',
  UPDATE_USER: '/api/auth/user',
  
  // Mock endpoints for testing without MongoDB
  MOCK_REGISTER: '/api/auth/mock/register',
  MOCK_LOGIN: '/api/auth/mock/login'
};

// Log the API URL for debugging
console.log(
    "API_URL :",
    API_URL,
    "USE_MOCK_API:",
    USE_MOCK_API
);