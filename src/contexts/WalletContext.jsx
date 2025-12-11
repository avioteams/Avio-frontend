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

  useEffect(() => {
    initializeWallet()
  }, [])

  const initializeWallet = async () => {
    // Test backend (non-blocking)
    testBackendConnection()
    
    // Restore session
    await restoreSession()
    
    // Setup listeners
    setupEventListeners()
  }

  const testBackendConnection = async () => {
    try {
      const health = await api.healthCheck()
      console.log('Backend connected:', health)
    } catch (err) {
      console.error('Backend connection failed:', err.message)
      // Don't block - app can work with cached data
    }
  }

  const restoreSession = async () => {
    const savedAccount = localStorage.getItem('walletAccount')
    const savedToken = localStorage.getItem('authToken')
    const savedWalletType = localStorage.getItem('walletType')

    if (!savedAccount || !savedToken) return

    if (!window.ethereum) {
      clearSession()
      return
    }

    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      const network = await web3Provider.getNetwork()
      
      setAccount(savedAccount)
      setProvider(web3Provider)
      setChainId(Number(network.chainId))
      setWalletType(savedWalletType)
      
      if (Number(network.chainId) !== AVALANCHE_CHAIN_ID) {
        toast.warning('Please switch back to Avalanche')
      }
    } catch (err) {
      clearSession()
    }
  }

  const setupEventListeners = () => {
    if (!window.ethereum) return

    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        disconnect()
      } else if (accounts[0] !== account) {
        handleAccountSwitch(accounts[0])
      }
    })

    window.ethereum.on('chainChanged', (chainId) => {
      const newChainId = parseInt(chainId, 16)
      setChainId(newChainId)
      
      if (newChainId !== AVALANCHE_CHAIN_ID) {
        toast.error('Please switch to Avalanche')
        disconnect()
      }
    })
  }

  const handleAccountSwitch = async (newAccount) => {
    try {
      setAccount(newAccount)
      localStorage.setItem('walletAccount', newAccount)
      
      const token = await authenticate(newAccount, provider)
      localStorage.setItem('authToken', token)
      
      toast.info(`Switched to ${newAccount.slice(0, 6)}...${newAccount.slice(-4)}`)
    } catch (err) {
      toast.error('Failed to authenticate new account')
      disconnect()
    }
  }

  // FIXED: Now accepts a specific wallet provider as parameter
  const connectWallet = async (preferredWallet = null, specificProvider = null) => {
    // Use the specific provider passed from WalletModal, or fall back to window.ethereum
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

      // First, check if there are already connected accounts (no popup needed)
      let accounts = []
      try {
        accounts = await walletProvider.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          console.log('✅ Using already connected account:', accounts[0])
        }
      } catch (err) {
        console.log('No existing connection, will request new one')
      }

      // If no accounts, request connection (this will show popup)
      if (accounts.length === 0) {
        console.log('🔓 Opening wallet popup for authorization...')
        
        // Add timeout to prevent hanging
        const requestAccountsWithTimeout = Promise.race([
          walletProvider.request({
            method: 'eth_requestAccounts'
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection request timed out.\n\nPlease check:\n• MetaMask popup is not blocked\n• MetaMask is unlocked\n• No pending requests in MetaMask')), 30000)
          )
        ])

        accounts = await requestAccountsWithTimeout
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet')
      }

      console.log('✅ Got accounts:', accounts[0])

      // Create ethers provider from the specific wallet provider
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

      const token = await authenticate(accounts[0], web3Provider)

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
      const { nonce } = await api.getNonce(address)

      const signer = await providerInstance.getSigner()
      const message = `Welcome to Avio!\n\nSign this message to authenticate.\n\nAddress: ${address}\nNonce: ${nonce}\nChain: Avalanche\n\nThis signature is free and won't cost gas.`
      
      const signature = await signer.signMessage(message)

      const { token } = await api.verifySignature({
        address,
        signature,
        message,
        nonce,
        chainId: AVALANCHE_CHAIN_ID
      })

      return token

    } catch (err) {
      if (err.code === 4001) {
        throw new Error('Signature request rejected')
      }
      throw err
    }
  }

  const switchToAvalanche = async (providerToUse = null) => {
    const targetProvider = providerToUse || window.ethereum
    
    try {
      await targetProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_HEX }]
      })
      setChainId(AVALANCHE_CHAIN_ID)
    } catch (err) {
      if (err.code === 4902) {
        await targetProvider.request({
          method: 'wallet_addEthereumChain',
          params: [AVALANCHE_CONFIG]
        })
        setChainId(AVALANCHE_CHAIN_ID)
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
    }

    toast.error(message)
  }

  const disconnect = () => {
    clearSession()
    toast.success('Wallet disconnected')
  }

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