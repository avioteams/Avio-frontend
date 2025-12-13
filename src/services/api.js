import { API_BASE_URL, API_ENDPOINTS, getAuthHeaders } from '@/config/api'

class ApiService {
  // Helper method for handling fetch errors
  async handleResponse(response, errorMessage) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || errorData.error || errorMessage)
    }
    return await response.json()
  }

  // Test backend connection
  async healthCheck() {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.health}`, {
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) throw new Error(`Backend returned ${response.status}`)
      
      return await response.json()
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Backend connection timeout')
      }
      throw err
    }
  }

  // Authentication - FIXED: Use query params instead of body
  async getNonce(address) {
    if (!address) throw new Error('Address is required')

    // Backend expects ?wallet=0x... as query param, not body
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.nonce}?wallet=${address}`, {
      method: 'GET', // Changed from POST to GET
      headers: { 'Content-Type': 'application/json' }
    })
    return await this.handleResponse(response, 'Failed to get nonce')
  }

  async verifySignature(data) {
    if (!data?.address || !data?.signature) {
      throw new Error('Address and signature are required')
    }

    // Check if backend expects query params or body for verify endpoint
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.verify}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet: data.address,  // Backend might use 'wallet' instead of 'address'
        signature: data.signature,
        message: data.message,
        nonce: data.nonce,
        chainId: data.chainId
      })
    })
    return await this.handleResponse(response, 'Signature verification failed')
  }

  async verifyToken() {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.verifyToken}`, {
      headers: getAuthHeaders()
    })
    return await this.handleResponse(response, 'Token verification failed')
  }

  // Rules
  async getRules() {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.rules.list}`, {
      headers: getAuthHeaders()
    })
    return await this.handleResponse(response, 'Failed to fetch rules')
  }

  async createRule(ruleData) {
    if (!ruleData) throw new Error('Rule data is required')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.rules.create}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ruleData)
    })
    return await this.handleResponse(response, 'Failed to create rule')
  }

  async getRuleDetails(ruleId) {
    if (!ruleId) throw new Error('Rule ID is required')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.rules.details(ruleId)}`, {
      headers: getAuthHeaders()
    })
    return await this.handleResponse(response, 'Failed to fetch rule details')
  }

  async getRulePrice(ruleId) {
    if (!ruleId) throw new Error('Rule ID is required')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.rules.price(ruleId)}`, {
      headers: getAuthHeaders()
    })
    return await this.handleResponse(response, 'Failed to fetch price')
  }

  async executeRule(ruleId) {
    if (!ruleId) throw new Error('Rule ID is required')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.rules.execute(ruleId)}`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return await this.handleResponse(response, 'Failed to execute rule')
  }

  async activateRule(ruleId) {
    if (!ruleId) throw new Error('Rule ID is required')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.rules.activate(ruleId)}`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return await this.handleResponse(response, 'Failed to activate rule')
  }

  // AI
  async parseInstruction(instruction) {
    if (!instruction) throw new Error('Instruction is required')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ai.parse}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ instruction })
    })
    return await this.handleResponse(response, 'Failed to parse instruction')
  }

  // Transactions
  async getTransactionReceipt(txHash) {
    if (!txHash) throw new Error('Transaction hash is required')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.transactions.receipt(txHash)}`, {
      headers: getAuthHeaders()
    })
    return await this.handleResponse(response, 'Failed to fetch receipt')
  }

  // Wallet
  async getBalance() {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.wallet.balance}`, {
      headers: getAuthHeaders()
    })
    return await this.handleResponse(response, 'Failed to fetch balance')
  }

  // Savings
  async getSavings() {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.savings.list}`, {
      headers: getAuthHeaders()
    })
    return await this.handleResponse(response, 'Failed to fetch savings')
  }

  async createSavingsGoal(goalData) {
    if (!goalData) throw new Error('Goal data is required')

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.savings.create}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(goalData)
    })
    return await this.handleResponse(response, 'Failed to create savings goal')
  }
}

export const api = new ApiService()