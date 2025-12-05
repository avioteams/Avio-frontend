import { Navigate } from 'react-router-dom'
import { useWallet } from '@/contexts/WalletContext'

export default function ProtectedRoute({ children }) {
  const { isConnected, isConnecting, isOnAvalanche } = useWallet()

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e30101]/30 border-t-[#e30101] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Connecting to Avalanche...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return <Navigate to="/" replace />
  }

  if (!isOnAvalanche) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#121212]">
        <div className="text-center max-w-md p-8">
          <p className="text-[#e30101] text-xl font-bold mb-4">Wrong Network</p>
          <p className="text-white/70">Please switch to Avalanche network in your wallet</p>
        </div>
      </div>
    )
  }

  return children
}