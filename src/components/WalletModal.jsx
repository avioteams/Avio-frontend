import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/WalletContext"
import { Loader2, X, ExternalLink, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function WalletModal({ open, onClose }) {
  const { connectWallet, isConnecting } = useWallet()
  const [wallets, setWallets] = useState({ metamask: false, core: false })
  const [hoveredWallet, setHoveredWallet] = useState(null)
  const [connectingWallet, setConnectingWallet] = useState(null)

  useEffect(() => {
    if (open && typeof window !== 'undefined') {
      const detected = detectWallets()
      setWallets(detected)
    }
  }, [open])

  const detectWallets = () => {
    let hasMetaMask = false
    let hasCoreWallet = false

    if (window.ethereum?.providers && Array.isArray(window.ethereum.providers)) {
      window.ethereum.providers.forEach((provider) => {
        if (provider.isMetaMask && !provider.isCoreWallet && !provider.isAvalanche) {
          hasMetaMask = true
        }
        if (provider.isCoreWallet || provider.isAvalanche) {
          hasCoreWallet = true
        }
      })
    } else if (window.ethereum) {
      if (window.ethereum.isMetaMask && !window.ethereum.isCoreWallet && !window.ethereum.isAvalanche) {
        hasMetaMask = true
      }
      if (window.ethereum.isCoreWallet || window.ethereum.isAvalanche) {
        hasCoreWallet = true
      }
    }

    if (window.avalanche) {
      hasCoreWallet = true
    }

    return { metamask: hasMetaMask, core: hasCoreWallet }
  }

  const getProvider = (walletType) => {
    if (walletType === 'metamask') {
      if (window.ethereum?.providers && Array.isArray(window.ethereum.providers)) {
        const metamaskProvider = window.ethereum.providers.find(
          p => p.isMetaMask === true && !p.isCoreWallet && !p.isAvalanche
        )
        if (metamaskProvider) {
          console.log('✅ Found MetaMask in providers array')
          return metamaskProvider
        }
      }
      
      if (window.ethereum?.isMetaMask && !window.ethereum.isCoreWallet && !window.ethereum.isAvalanche) {
        console.log('✅ Found MetaMask as single provider')
        return window.ethereum
      }
      
      console.error('❌ MetaMask provider not found')
      return null
    } 
    else if (walletType === 'core') {
      if (window.avalanche) {
        console.log('✅ Found Core via window.avalanche')
        return window.avalanche
      }
      
      if (window.ethereum?.providers && Array.isArray(window.ethereum.providers)) {
        const coreProvider = window.ethereum.providers.find(p => p.isCoreWallet || p.isAvalanche)
        if (coreProvider) {
          console.log('✅ Found Core in providers array')
          return coreProvider
        }
      }
      
      if (window.ethereum?.isCoreWallet || window.ethereum?.isAvalanche) {
        console.log('✅ Found Core as single provider')
        return window.ethereum
      }
      
      console.error('❌ Core provider not found')
      return null
    }
    
    return null
  }

  const handleConnect = async (walletType) => {
    if (connectingWallet) {
      console.log('⚠️ Already connecting to:', connectingWallet)
      return
    }
    
    console.log(`🔗 Starting connection to: ${walletType}`)
    setConnectingWallet(walletType)
    
    try {
      const provider = getProvider(walletType)

      if (!provider) {
        const walletName = walletType === 'metamask' ? 'MetaMask' : 'Core Wallet'
        throw new Error(`${walletName} provider not found`)
      }

      // Check if provider is ready (important for MetaMask)
      if (typeof provider.request !== 'function') {
        throw new Error('Wallet provider is not ready. Please refresh the page.')
      }

      console.log(`📡 Connecting with specific ${walletType} provider...`)
      
      // Show a toast to guide the user
      const walletName = walletType === 'metamask' ? 'MetaMask' : 'Core Wallet'
      
      // Check for popup blockers
      if (window.self !== window.top) {
        console.warn('Running in iframe - popups might be blocked')
      }
      
      // FIXED: Pass the specific provider directly to connectWallet
      await connectWallet(walletType, provider)
      
      console.log(`✅ Successfully connected to ${walletType}`)
      onClose()
      
    } catch (err) {
      console.error(`❌ ${walletType} connection error:`, err)
      
      let errorMessage = ''
      
      if (err.code === 4001) {
        errorMessage = 'You rejected the connection request. Click connect again when ready.'
      } else if (err.code === -32002) {
        errorMessage = 'A connection request is already pending in your wallet. Please open your wallet and approve or reject it first.'
      } else if (err.message?.includes('timed out')) {
        errorMessage = `Connection timed out. Please:\n\n1. Check if ${walletType === 'metamask' ? 'MetaMask' : 'Core Wallet'} popup appeared\n2. Make sure popup blockers are disabled\n3. Unlock your wallet if it's locked\n4. Try clicking the wallet extension icon manually`
      } else if (err.message?.includes('not ready')) {
        errorMessage = 'Wallet is not ready. Please refresh the page and try again.'
      } else {
        errorMessage = `Failed to connect: ${err.message || 'Unknown error'}`
      }
      
      alert(errorMessage)
    } finally {
      setConnectingWallet(null)
    }
  }

  const hasNoWallet = !wallets.metamask && !wallets.core

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-none bg-[#121212] max-w-[440px] p-0 overflow-hidden rounded-3xl shadow-2xl">
        {/* ACCESSIBILITY FIX: Added hidden title and description */}
        <VisuallyHidden>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose your preferred wallet provider to connect to Avio
          </DialogDescription>
        </VisuallyHidden>

        <div className="absolute hidden inset-0 bg-gradient-to-br from-[#e30101]/10 via-transparent to-[#e30101]/5 pointer-events-none" />

        <div className="relative p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Connect to Avio
            </h2>
            <p className="text-white/50 text-sm">
              Choose your wallet to get started
            </p>
          </div>

          {hasNoWallet && (
            <div className="mb-6 p-5 rounded-2xl bg-[#e30101]/10 border border-[#e30101]/20 backdrop-blur-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#e30101]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⚠️</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">No Wallet Found</h4>
                  <p className="text-white/60 text-sm">
                    Install a wallet extension to continue
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-11 text-sm">
                    <span className="mr-2">🦊</span> MetaMask
                  </Button>
                </a>
                <a 
                  href="https://core.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-11 text-sm">
                    <span className="mr-2">
                      <img src="./avalanche-logo.png" className="w-8" alt="" />
                    </span> Core
                  </Button>
                </a>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-6">
            {wallets.metamask && (
              <button
                onClick={() => handleConnect('metamask')}
                disabled={connectingWallet !== null}
                onMouseEnter={() => !connectingWallet && setHoveredWallet('metamask')}
                onMouseLeave={() => setHoveredWallet(null)}
                className="w-full group relative"
              >
                <div className={`
                  relative overflow-hidden rounded-2xl p-5 transition-all duration-300
                  ${hoveredWallet === 'metamask' ? 'bg-gradient-to-br from-orange-500/15 to-orange-600/10' : 'bg-white/5'}
                  border ${hoveredWallet === 'metamask' ? 'border-orange-500/40' : 'border-white/10'}
                  hover:shadow-lg hover:shadow-orange-500/10
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                        transition-all duration-300 shadow-lg
                        ${hoveredWallet === 'metamask' ? 'bg-gradient-to-br from-orange-500 to-orange-600 scale-110' : 'bg-white/10'}
                      `}>
                        🦊
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white text-lg mb-0.5">MetaMask</p>
                        <p className="text-white/50 text-xs">Popular browser wallet</p>
                      </div>
                    </div>
                    
                    {connectingWallet === 'metamask' ? (
                      <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                    ) : (
                      <div className={`
                        transition-all duration-300
                        ${hoveredWallet === 'metamask' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                      `}>
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                          <span className="text-orange-500 text-xl">→</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                    transition-transform duration-700
                    ${hoveredWallet === 'metamask' ? 'translate-x-full' : '-translate-x-full'}
                  `} />
                </div>
              </button>
            )}

            {wallets.core && (
              <button
                onClick={() => handleConnect('core')}
                disabled={connectingWallet !== null}
                onMouseEnter={() => !connectingWallet && setHoveredWallet('core')}
                onMouseLeave={() => setHoveredWallet(null)}
                className="w-full group relative"
              >
                <div className={`
                  relative overflow-hidden rounded-2xl p-5 transition-all duration-300
                  ${hoveredWallet === 'core' ? 'bg-gradient-to-br from-[#e30101]/15 to-[#c10101]/10' : 'bg-white/5'}
                  border ${hoveredWallet === 'core' ? 'border-[#e30101]/40' : 'border-white/10'}
                  hover:shadow-lg hover:shadow-[#e30101]/10
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                        transition-all duration-300 shadow-lg
                        ${hoveredWallet === 'core' ? 'bg-gradient-to-br from-[#e30101] to-[#c10101] scale-110' : 'bg-white/10'}
                      `}>
                        <img src="./avalanche-logo.png" className="w-8" alt="" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white text-lg mb-0.5">Core Wallet</p>
                        <p className="text-white/50 text-xs">Native Avalanche wallet</p>
                      </div>
                    </div>
                    
                    {connectingWallet === 'core' ? (
                      <Loader2 className="w-5 h-5 text-[#e30101] animate-spin" />
                    ) : (
                      <div className={`
                        transition-all duration-300
                        ${hoveredWallet === 'core' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                      `}>
                        <div className="w-10 h-10 rounded-xl bg-[#e30101]/20 flex items-center justify-center">
                          <span className="text-[#e30101] text-xl">→</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
                    transition-transform duration-700
                    ${hoveredWallet === 'core' ? 'translate-x-full' : '-translate-x-full'}
                  `} />
                </div>
              </button>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border hidden border-white/10 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#e30101]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🔒</span>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm mb-2">
                  Secure Connection
                </h4>
                <ul className="space-y-1.5 text-xs text-white/60">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#e30101]" />
                    Your keys never leave your wallet
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#e30101]" />
                    No fees to connect
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#e30101]" />
                    Powered by Avalanche Fuji Testnet
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              Don't have an Ethereum wallet?{' '}
              <a 
                href="https://ethereum.org/en/wallets/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#e30101] hover:text-[#ff0000] inline-flex items-center gap-1 transition-colors"
              >
                Get one
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}