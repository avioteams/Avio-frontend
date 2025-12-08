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

  const connectWallet = async (preferredWallet = null) => {
    if (!window.ethereum) {
      toast.error('No wallet detected. Please install MetaMask or Core Wallet.')
      return null
    }

    setIsConnecting(true)

    try {
      const detectedWallet = detectWallet(preferredWallet)
      setWalletType(detectedWallet)

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet')
      }

      let web3Provider = new ethers.BrowserProvider(window.ethereum)
      const network = await web3Provider.getNetwork()
      const currentChainId = Number(network.chainId)

      setChainId(currentChainId)

      if (currentChainId !== AVALANCHE_CHAIN_ID) {
        toast.info('Switching to Avalanche...')
        await switchToAvalanche()
        web3Provider = new ethers.BrowserProvider(window.ethereum)
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

  const detectWallet = (preferred = null) => {
    if (preferred === 'core' && window.ethereum?.isCoreWallet) return 'core'
    if (preferred === 'metamask' && window.ethereum?.isMetaMask) return 'metamask'
    if (window.ethereum?.isCoreWallet) return 'core'
    if (window.ethereum?.isMetaMask) return 'metamask'
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

  const switchToAvalanche = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_HEX }]
      })
      setChainId(AVALANCHE_CHAIN_ID)
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
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