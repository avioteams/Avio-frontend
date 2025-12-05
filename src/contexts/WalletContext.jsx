import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'sonner'

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
  const [walletType, setWalletType] = useState(null) // 'metamask' or 'core'

  useEffect(() => {
    restoreSession()
    setupEventListeners()
  }, [])

  // Restore previous session
  const restoreSession = async () => {
    const savedAccount = localStorage.getItem('walletAccount')
    const savedToken = localStorage.getItem('authToken')
    const savedWalletType = localStorage.getItem('walletType')

    if (savedAccount && savedToken && window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum)
        const network = await web3Provider.getNetwork()
        
        setAccount(savedAccount)
        setProvider(web3Provider)
        setChainId(Number(network.chainId))
        setWalletType(savedWalletType)
        
        // Verify we're still on Avalanche
        if (Number(network.chainId) !== AVALANCHE_CHAIN_ID) {
          toast.warning('Please switch back to Avalanche')
        }
      } catch (err) {
        clearSession()
      }
    }
  }

  // Listen for wallet events
  const setupEventListeners = () => {
    if (!window.ethereum) return

    // Account changes
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        disconnect()
        toast.error('Wallet disconnected')
      } else if (accounts[0] !== account) {
        handleAccountSwitch(accounts[0])
      }
    })

    // Network changes
    window.ethereum.on('chainChanged', (chainId) => {
      const newChainId = parseInt(chainId, 16)
      setChainId(newChainId)
      
      if (newChainId !== AVALANCHE_CHAIN_ID) {
        toast.error('Wrong network! Please switch to Avalanche')
        disconnect()
      } else {
        toast.success('Connected to Avalanche')
      }
    })

    // Disconnection
    window.ethereum.on('disconnect', () => {
      disconnect()
    })
  }

  // Handle account switch in wallet
  const handleAccountSwitch = async (newAccount) => {
    try {
      setAccount(newAccount)
      localStorage.setItem('walletAccount', newAccount)
      
      // Re-authenticate with new account
      const token = await authenticate(newAccount, provider)
      localStorage.setItem('authToken', token)
      
      toast.info(`Switched to ${newAccount.slice(0, 6)}...${newAccount.slice(-4)}`)
    } catch (err) {
      toast.error('Failed to authenticate new account')
      disconnect()
    }
  }

  // Main connection function
  const connectWallet = async (preferredWallet = null) => {
    if (!window.ethereum) {
      toast.error('No wallet detected. Please install MetaMask or Core Wallet.')
      return null
    }

    setIsConnecting(true)

    try {
      // Detect which wallet to use
      const detectedWallet = detectWallet(preferredWallet)
      setWalletType(detectedWallet)

      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet')
      }

      // Create provider
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      const network = await web3Provider.getNetwork()
      const currentChainId = Number(network.chainId)

      setChainId(currentChainId)

      // Enforce Avalanche network
      if (currentChainId !== AVALANCHE_CHAIN_ID) {
        toast.info('Switching to Avalanche...')
        await switchToAvalanche()
        // Refresh provider after network switch
        const newProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(newProvider)
        web3Provider = newProvider
      } else {
        setProvider(web3Provider)
      }

      // Authenticate with backend
      const token = await authenticate(accounts[0], web3Provider)

      // Save session
      setAccount(accounts[0])
      localStorage.setItem('walletAccount', accounts[0])
      localStorage.setItem('authToken', token)
      localStorage.setItem('walletType', detectedWallet)

      toast.success(`Connected via ${detectedWallet === 'core' ? 'Core Wallet' : 'MetaMask'}!`)
      return accounts[0]

    } catch (err) {
      handleError(err)
      throw err
    } finally {
      setIsConnecting(false)
    }
  }

  // Detect which wallet is being used
  const detectWallet = (preferred = null) => {
    if (preferred === 'core' && window.ethereum?.isCoreWallet) {
      return 'core'
    }
    if (preferred === 'metamask' && window.ethereum?.isMetaMask) {
      return 'metamask'
    }
    
    // Auto-detect
    if (window.ethereum?.isCoreWallet) return 'core'
    if (window.ethereum?.isMetaMask) return 'metamask'
    
    return 'unknown'
  }

  // Signature-based authentication
  const authenticate = async (address, providerInstance) => {
    try {
      // Step 1: Get nonce from backend
      const nonceResponse = await fetch('/api/auth/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })

      if (!nonceResponse.ok) {
        throw new Error('Failed to get authentication nonce')
      }

      const { nonce } = await nonceResponse.json()

      // Step 2: Sign message with wallet
      const signer = await providerInstance.getSigner()
      const message = `Welcome to Avio!\n\nSign this message to authenticate.\n\nAddress: ${address}\nNonce: ${nonce}\nChain: Avalanche\n\nThis signature is free and won't cost gas.`
      
      const signature = await signer.signMessage(message)

      // Step 3: Verify signature on backend
      const authResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          signature,
          message,
          nonce,
          chainId: AVALANCHE_CHAIN_ID
        })
      })

      if (!authResponse.ok) {
        const error = await authResponse.json()
        throw new Error(error.error || 'Authentication failed')
      }

      const { token } = await authResponse.json()
      return token

    } catch (err) {
      if (err.code === 4001) {
        throw new Error('Signature request rejected')
      }
      throw err
    }
  }

  // Switch to Avalanche network
  const switchToAvalanche = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_HEX }]
      })
      setChainId(AVALANCHE_CHAIN_ID)
    } catch (err) {
      // Chain not added yet
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_CONFIG]
          })
          setChainId(AVALANCHE_CHAIN_ID)
          toast.success('Avalanche network added!')
        } catch (addError) {
          throw new Error('Failed to add Avalanche network')
        }
      } else if (err.code === 4001) {
        throw new Error('Network switch rejected')
      } else {
        throw err
      }
    }
  }

  // Error handler with user-friendly messages
  const handleError = (err) => {
    let message = err.message || 'An error occurred'

    if (err.code === 4001) {
      message = 'Request rejected by user'
    } else if (err.code === -32002) {
      message = 'Request pending. Please check your wallet.'
    } else if (err.code === 4902) {
      message = 'Please add Avalanche network to your wallet'
    } else if (message.includes('user rejected')) {
      message = 'Signature rejected by user'
    }

    toast.error(message)
  }

  // Disconnect wallet
  const disconnect = () => {
    clearSession()
    toast.success('Wallet disconnected')
  }

  // Clear all session data
  const clearSession = () => {
    setAccount(null)
    setProvider(null)
    setChainId(null)
    setWalletType(null)
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
    connectWallet,
    disconnect,
    switchToAvalanche,
    isConnected: !!account,
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