// src/pages/Wallet.jsx (or AddFunds.jsx)
import { useState, useEffect } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { IconQrcode, IconCopy, IconShare, IconCheck } from "@tabler/icons-react"
import { toast } from 'sonner'
import QRCode from 'react-qr-code'

export default function Wallet() {
  const { account } = useWallet()
  const [balance, setBalance] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      const data = await response.json()
      setBalance(data.balance)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    }
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(account)
    setCopied(true)
    toast.success('Address copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const shareData = {
      title: 'My Avio Wallet',
      text: `Send funds to my Avio wallet: ${account}`,
      url: `https://avio.app/pay/${account}`
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback for desktop
        navigator.clipboard.writeText(shareData.text)
        toast.success('Details copied to clipboard!')
      }
    } catch (err) {
      console.error('Share failed:', err)
    }
  }

  return (
    <div className='grid gap-6'>
      <div>
        <h1 className='font-semibold text-3xl mb-2'>Fund Wallet</h1>
        <p className='text-black/60'>Add funds to your Avalanche wallet</p>
      </div>

      <div className="grid gap-8">
        {/* Balance Card */}
        <Card className="w-full bg-black/1 border-black/4">
          <CardHeader>
            <CardDescription className="text-black/60">Current Balance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='font-semibold text-4xl text-black'>
              NGN{balance.toLocaleString()}
            </p>
            <p className='text-sm text-black/40 mt-2'>Avalanche C-Chain</p>
          </CardContent>
        </Card>

        {/* Wallet Address Card */}
        <Card className="w-full bg-black/1 border-black/4">
          <CardHeader>
            <CardDescription className="text-black/60">Your Wallet Address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black/1 p-4 rounded-lg border border-black/4">
              <p className='font-mono text-sm text-black break-all'>
                {account}
              </p>
            </div>
            <p className='text-xs text-black/40 mt-2'>
              Share this address to receive funds from any Avalanche wallet
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button 
              onClick={handleCopyAddress}
              className="bg-[#e30101] hover:bg-[#c10101] rounded-full flex-1"
            >
              {copied ? (
                <>
                  <IconCheck className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <IconCopy className="w-4 h-4 mr-2" />
                  Copy Address
                </>
              )}
            </Button>
            <Button 
              onClick={handleShare}
              className="border border-black/20 text-black rounded-full flex-1 bg-black/1 hover:bg-black/5"
            >
              <IconShare className="w-4 h-4 mr-2" />
              Share Details
            </Button>
          </CardFooter>
        </Card>

        <Separator className="bg-black/10" />

        {/* QR Code Card */}
        <Card className="bg-black/1 border-black/4 hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white p-4 rounded-lg">
                <QRCode 
                  value={account || ''} 
                  size={200}
                  level="H"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-[#e30101] text-white w-max h-max p-3 rounded-full">
                    <IconQrcode className="w-6 h-6" />
                  </div>
                  <div>
                    <p className='font-semibold text-2xl text-black mb-2'>Scan QR Code</p>
                    <CardDescription className="text-black/60">
                      Anyone with an Avalanche wallet can scan this code to send you funds instantly
                    </CardDescription>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-black/60">
                  <p>✓ Works with any Avalanche wallet</p>
                  <p>✓ Instant transfers</p>
                  <p>✓ Secure and encrypted</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Add Funds */}
        <Card className="bg-black/1 border-black/4">
          <CardHeader>
            <h3 className="text-lg font-semibold text-black">How to Add Funds</h3>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-black/70">
              <li className="flex gap-3">
                <span className="bg-[#e30101] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
                <span>Copy your wallet address or show your QR code</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-[#e30101] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
                <span>Send AVAX or tokens from any Avalanche wallet</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-[#e30101] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                <span>Funds will appear in your balance within seconds</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}