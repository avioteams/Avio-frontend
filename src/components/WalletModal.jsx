import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/WalletContext"

export default function WalletModal({ open, onClose }) {
  const { connectWallet, isConnecting } = useWallet()

  const handleConnect = async (walletType) => {
    try {
      await connectWallet(walletType)
      onClose()
    } catch (err) {
      // Error already handled with toast
    }
  }

  // Check what's installed
  const hasMetaMask = typeof window !== 'undefined' && window.ethereum?.isMetaMask
  const hasCoreWallet = typeof window !== 'undefined' && window.ethereum?.isCoreWallet
  const hasNoWallet = typeof window !== 'undefined' && !window.ethereum

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-black/10 bg-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#121212]">Connect to Avalanche</DialogTitle>
          <p className="text-sm text-[#121212]/60 mt-2">
            Choose your preferred wallet to continue
          </p>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {/* No wallet detected */}
          {hasNoWallet && (
            <div className="p-4 bg-[#e30101]/10 border border-[#e30101]/30 rounded-lg">
              <p className="text-sm text-black/80 mb-3">
                No wallet detected. Install one to continue:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-black/10 hover:bg-black/20">
                    <span className="mr-2">🦊</span> MetaMask
                  </Button>
                </a>
                <a 
                  href="https://core.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-black/10 hover:bg-white/20">
                    <span className="mr-2">⚡</span> Core
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* MetaMask option */}
          {hasMetaMask && (
            <Button
              onClick={() => handleConnect('metamask')}
              disabled={isConnecting}
              className="w-full h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center justify-between px-6 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  🦊
                </div>
                <div className="text-left">
                  <p className="font-semibold">MetaMask</p>
                  <p className="text-xs text-white/80">Browser extension</p>
                </div>
              </div>
              {isConnecting && (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
            </Button>
          )}

          {/* Core Wallet option */}
          {hasCoreWallet && (
            <Button
              onClick={() => handleConnect('core')}
              disabled={isConnecting}
              className="w-full h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-between px-6 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  ⚡
                </div>
                <div className="text-left">
                  <p className="font-semibold">Core Wallet</p>
                  <p className="text-xs text-white/80">Native Avalanche</p>
                </div>
              </div>
              {isConnecting && (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
            </Button>
          )}

          {/* If only one wallet, show generic option */}
          {!hasNoWallet && !hasMetaMask && !hasCoreWallet && (
            <Button
              onClick={() => handleConnect()}
              disabled={isConnecting}
              className="w-full h-16 bg-[#e30101] hover:bg-[#c10101] text-[white]"
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}

          {/* Security info */}
          <div className="mt-6 p-4 bg-black/3 rounded-lg border border-black/10">
            <div className="flex items-start gap-3">
              {/* <div className="text-2xl">🔒</div> */}
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Secure Connection</h4>
                <ul className="text-xs text-[#121212]/70 space-y-1">
                  <li>Your keys never leave your wallet</li>
                  <li>Signature-based authentication</li>
                  <li>No transaction fees to connect</li>
                  <li>Avalanche network only</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#121212]/50 text-center">
            By connecting, you agree to our Terms of Service
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}