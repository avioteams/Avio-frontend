export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://avio-backend-v6no.onrender.com"

// API endpoints
export const API_ENDPOINTS = {
    // Health check
    health: '/system/health',
    
    // Auth
    auth: {
      nonce: '/api/auth/nonce',
      verify: '/api/auth/verify',
      verifyToken: '/api/auth/verify-token'
    },

    // Rules
    rules: {
      list: '/api/rules',
      create: '/api/rules/create',
      details: (id) => `/api/rules/${id}`,
      price: (id) => `/api/rules/${id}/price`,
      execute: (id) => `/api/rules/${id}/execute`,
      activate: (id) => `/api/rules/${id}/activate`,
    },

    // AI
    ai: {
        parse: '/api/ai/parse',
    },

    // Transactions
    transactions: {
      receipt: (txHash) => `/api/transactions/${txHash}`
    },

    // Wallet
    wallet: {
      balance: '/api/wallet/balance'
    },

    // Savings
    savings: {
      list: '/api/savings',
      create: '/api/savings/create'
    }
}

// Helper function to build full URL
export const buildUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

// Helper for authenticated requests
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  
  if (!token) {
    console.warn('No auth token found in localStorage')
  }
  
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}