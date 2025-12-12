import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'sonner'
import { api } from '@/services/api'

const WalletContext = createContext()

const AVALANCHE_CHAIN_ID = 43114
const AVALANCHE_HEX = '0xA86A'
const AVALANCHE_CONFIG = {
  chainId: AVALANCHE_HEX,
  chainName: 'Avalanche C-Chain',
  nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowtrace.io/']
}

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletType, setWalletType] = useState(null)
  const [backendStatus, setBackendStatus] = useState('checking') // 'checking' | 'connected' | 'failed'
  const [isAuthenticated, setIsAuthenticated] = useState(false) // NEW: Track auth status

  useEffect(() => {
    initializeWallet()
  }, [])

  const initializeWallet = async () => {
    // MUST check backend first - blocking operation
    const backendAvailable = await testBackendConnection()
    
    if (!backendAvailable) {
      console.error('❌ Cannot initialize: Backend required for authentication')
      return
    }
    
    // Only restore session if backend is available
    await restoreSession()
    
    // Setup listeners
    setupEventListeners()
  }

  const testBackendConnection = async () => {
    const maxRetries = 3
    const timeout = 60000 // 60 seconds for Render wake-up
    
    setBackendStatus('checking')
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Backend connection attempt ${attempt}/${maxRetries}...`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)
        
        const response = await fetch('https://avio-backend-v6no.onrender.com/system/health', {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' }
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const health = await response.json()
          console.log('✅ Backend connected:', health)
          setBackendStatus('connected')
          return true
        }
        
        throw new Error(`HTTP ${response.status}`)
        
      } catch (err) {
        if (err.name === 'AbortError') {
          console.warn(`⏱️ Attempt ${attempt} timeout - backend is waking up...`)
        } else {
          console.warn(`⚠️ Attempt ${attempt} failed:`, err.message)
        }
        
        // Last attempt failed
        if (attempt === maxRetries) {
          console.error('❌ Backend connection failed after all retries')
          setBackendStatus('failed')
          
          toast.error('Unable to connect to authentication server. Please try again later.', {
            duration: 7000,
            action: {
              label: 'Retry',
              onClick: () => window.location.reload()
            }
          })
          
          return false
        }
        
        // Show progress toast during retries
        if (attempt === 3) {
          toast.loading('Connecting to server... This may take up to 60 seconds', {
            id: 'backend-connecting'
          })
        }
        
        // Exponential backoff before retry
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt))
      }
    }
    
    return false
  }

  const restoreSession = async () => {
    const savedAccount = localStorage.getItem('walletAccount')
    const savedToken = localStorage.getItem('authToken')
    const savedWalletType = localStorage.getItem('walletType')

    // SECURITY: All three must exist for valid session
    if (!savedAccount || !savedToken || !savedWalletType) {
      console.log('No valid saved session found')
      return
    }

    if (!window.ethereum) {
      console.warn('Wallet not detected, clearing session')
      clearSession()
      return
    }

    try {
      // SECURITY: Verify token is still valid with backend
      const isValid = await verifyToken(savedToken, savedAccount)
      
      if (!isValid) {
        console.warn('Saved token is invalid or expired')
        clearSession()
        toast.warning('Session expired. Please reconnect your wallet.')
        return
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      const network = await web3Provider.getNetwork()
      
      // Verify the wallet still has this account
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (!accounts.includes(savedAccount)) {
        console.warn('Saved account not found in wallet')
        clearSession()
        return
      }
      
      setAccount(savedAccount)
      setProvider(web3Provider)
      setChainId(Number(network.chainId))
      setWalletType(savedWalletType)
      setIsAuthenticated(true) // SECURITY: Mark as authenticated
      
      console.log('✅ Session restored and verified:', {
        account: savedAccount,
        chainId: Number(network.chainId),
        wallet: savedWalletType
      })
      
      // Dismiss any loading toasts
      toast.dismiss('backend-connecting')
      
      if (Number(network.chainId) !== AVALANCHE_CHAIN_ID) {
        toast.warning('Please switch back to Avalanche')
      }
    } catch (err) {
      console.error('Failed to restore session:', err)
      clearSession()
    }
  }

  // SECURITY: Verify token with backend
  const verifyToken = async (token, address) => {
    try {
      const response = await api.verifyToken({ token, address })
      return response.valid === true
    } catch (err) {
      console.error('Token verification failed:', err)
      return false
    }
  }

  const setupEventListeners = () => {
    if (!window.ethereum) {
      console.warn('No ethereum provider found for event listeners')
      return
    }

    // Remove existing listeners to prevent duplicates
    window.ethereum.removeAllListeners?.('accountsChanged')
    window.ethereum.removeAllListeners?.('chainChanged')

    window.ethereum.on('accountsChanged', (accounts) => {
      console.log('👛 Accounts changed:', accounts)
      
      if (accounts.length === 0) {
        disconnect()
      } else if (accounts[0] !== account) {
        // SECURITY: Must re-authenticate on account switch
        handleAccountSwitch(accounts[0])
      }
    })

    window.ethereum.on('chainChanged', (chainIdHex) => {
      const newChainId = parseInt(chainIdHex, 16)
      console.log('🔗 Chain changed:', newChainId)
      
      setChainId(newChainId)
      
      if (newChainId !== AVALANCHE_CHAIN_ID) {
        toast.error('Wrong network! Please switch to Avalanche', {
          action: {
            label: 'Switch Now',
            onClick: () => switchToAvalanche()
          }
        })
      } else {
        toast.success('Connected to Avalanche')
      }
    })

    console.log('✅ Event listeners setup complete')
  }

  const handleAccountSwitch = async (newAccount) => {
    try {
      console.log('🔄 Account switched - re-authentication required:', newAccount)
      
      // SECURITY: Clear old session immediately
      setIsAuthenticated(false)
      
      if (backendStatus !== 'connected') {
        toast.error('Cannot authenticate: Backend unavailable')
        disconnect()
        return
      }
      
      // SECURITY: Must authenticate new account
      toast.loading('Authenticating new account...', { id: 'switch-auth' })
      
      const token = await authenticate(newAccount, provider)
      
      setAccount(newAccount)
      setIsAuthenticated(true)
      localStorage.setItem('walletAccount', newAccount)
      localStorage.setItem('authToken', token)
      
      toast.success(`Switched to ${newAccount.slice(0, 6)}...${newAccount.slice(-4)}`, {
        id: 'switch-auth'
      })
    } catch (err) {
      console.error('Failed to authenticate new account:', err)
      toast.error('Authentication failed. Please reconnect.', { id: 'switch-auth' })
      disconnect()
    }
  }

  const connectWallet = async (preferredWallet = null, specificProvider = null) => {
    // SECURITY: Backend must be available for authentication
    if (backendStatus !== 'connected') {
      toast.error('Authentication server unavailable. Please wait or refresh the page.', {
        action: {
          label: 'Refresh',
          onClick: () => window.location.reload()
        }
      })
      return null
    }

    const walletProvider = specificProvider || window.ethereum

    if (!walletProvider) {
      toast.error('No wallet detected. Please install MetaMask or Core Wallet.')
      return null
    }

    setIsConnecting(true)

    try {
      const detectedWallet = detectWallet(preferredWallet, walletProvider)
      setWalletType(detectedWallet)

      console.log(`📡 Requesting accounts from ${detectedWallet}...`)

      // Check for existing connection first
      let accounts = []
      try {
        accounts = await walletProvider.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          console.log('✅ Using already connected account:', accounts[0])
        }
      } catch (err) {
        console.log('No existing connection, will request new one')
      }

      // Request connection if needed
      if (accounts.length === 0) {
        console.log('🔓 Opening wallet popup for authorization...')
        
        const requestAccountsWithTimeout = Promise.race([
          walletProvider.request({ method: 'eth_requestAccounts' }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection request timed out.\n\nPlease check:\n• Wallet popup is not blocked\n• Wallet is unlocked\n• No pending requests in wallet')), 30000)
          )
        ])

        accounts = await requestAccountsWithTimeout
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet')
      }

      console.log('✅ Got accounts:', accounts[0])

      // Create provider and check network
      let web3Provider = new ethers.BrowserProvider(walletProvider)
      const network = await web3Provider.getNetwork()
      const currentChainId = Number(network.chainId)

      setChainId(currentChainId)

      if (currentChainId !== AVALANCHE_CHAIN_ID) {
        toast.info('Switching to Avalanche...')
        await switchToAvalanche(walletProvider)
        web3Provider = new ethers.BrowserProvider(walletProvider)
      }

      setProvider(web3Provider)

      // SECURITY: Authentication is REQUIRED - no bypass
      console.log('🔐 Starting authentication...')
      toast.loading('Authenticating...', { id: 'auth-process' })
      
      const token = await authenticate(accounts[0], web3Provider)
      
      // SECURITY: Only set account after successful authentication
      setAccount(accounts[0])
      setIsAuthenticated(true)
      localStorage.setItem('walletAccount', accounts[0])
      localStorage.setItem('authToken', token)
      localStorage.setItem('walletType', detectedWallet)

      toast.success(`Connected and authenticated via ${detectedWallet === 'core' ? 'Core Wallet' : 'MetaMask'}!`, {
        id: 'auth-process'
      })
      
      return accounts[0]

    } catch (err) {
      handleError(err)
      // SECURITY: Ensure no partial state on auth failure
      setIsAuthenticated(false)
      throw err
    } finally {
      setIsConnecting(false)
    }
  }

  const detectWallet = (preferred = null, providerToCheck = null) => {
    const checkProvider = providerToCheck || window.ethereum
    
    if (preferred === 'core' && checkProvider?.isCoreWallet) return 'core'
    if (preferred === 'metamask' && checkProvider?.isMetaMask) return 'metamask'
    if (checkProvider?.isCoreWallet) return 'core'
    if (checkProvider?.isMetaMask) return 'metamask'
    return 'unknown'
  }

  const authenticate = async (address, providerInstance) => {
    try {
      console.log('🔐 Starting authentication for:', address)
      
      // SECURITY: Get fresh nonce from backend
      const { nonce } = await api.getNonce(address)

      const signer = await providerInstance.getSigner()
      const message = `Welcome to Avio!\n\nSign this message to authenticate.\n\nAddress: ${address}\nNonce: ${nonce}\nChain: Avalanche\n\nThis signature is free and won't cost gas.`
      
      // SECURITY: User must sign message with their private key
      const signature = await signer.signMessage(message)

      // SECURITY: Backend verifies signature and issues token
      const { token } = await api.verifySignature({
        address,
        signature,
        message,
        nonce,
        chainId: AVALANCHE_CHAIN_ID
      })

      console.log('✅ Authentication successful')
      return token

    } catch (err) {
      if (err.code === 4001) {
        throw new Error('Signature request rejected')
      }
      console.error('Authentication failed:', err)
      throw err
    }
  }

  const switchToAvalanche = async (providerToUse = null) => {
    const targetProvider = providerToUse || window.ethereum
    
    try {
      console.log('🔄 Switching to Avalanche...')
      
      await targetProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_HEX }]
      })
      
      setChainId(AVALANCHE_CHAIN_ID)
      console.log('✅ Switched to Avalanche')
      
    } catch (err) {
      if (err.code === 4902) {
        console.log('Adding Avalanche network...')
        await targetProvider.request({
          method: 'wallet_addEthereumChain',
          params: [AVALANCHE_CONFIG]
        })
        setChainId(AVALANCHE_CHAIN_ID)
        console.log('✅ Avalanche network added')
      } else if (err.code !== 4001) {
        throw err
      }
    }
  }

  const handleError = (err) => {
    let message = err.message || 'An error occurred'

    if (err.code === 4001) {
      message = 'Request rejected by user'
    } else if (err.code === -32002) {
      message = 'Request pending. Please check your wallet.'
    } else if (err.message?.includes('timeout')) {
      message = 'Request timed out. Please try again.'
    }

    console.error('❌ Wallet error:', message, err)
    toast.error(message)
  }

  const disconnect = () => {
    console.log('👋 Disconnecting wallet')
    clearSession()
    toast.success('Wallet disconnected')
  }

  const clearSession = () => {
    setAccount(null)
    setProvider(null)
    setChainId(null)
    setWalletType(null)
    setIsAuthenticated(false) // SECURITY: Clear auth status
    localStorage.removeItem('walletAccount')
    localStorage.removeItem('authToken')
    localStorage.removeItem('walletType')
  }

  const value = {
    account,
    provider,
    chainId,
    isConnecting,
    walletType,
    backendStatus,
    isAuthenticated, // SECURITY: Expose auth status for protected routes
    connectWallet,
    disconnect,
    switchToAvalanche,
    retryBackend: testBackendConnection,
    isConnected: !!account && isAuthenticated, // SECURITY: Both must be true
    isOnAvalanche: chainId === AVALANCHE_CHAIN_ID
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}