import { useState } from 'react'
import { useWallet } from '@/contexts/WalletContext'
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Wallet, Moon, Sun } from 'lucide-react'
import { toast } from 'sonner'

export default function Settings() {
  const { account, disconnect } = useWallet()
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    transactions: true,
    priceAlerts: false
  })

  const handleDisconnect = () => {
    disconnect()
    window.location.href = '/'
  }

  const handleSaveNotifications = () => {
    // Save to backend
    toast.success('Notification preferences saved')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-black/60">Manage your account and preferences</p>
      </div>

      {/* Account Section */}
      <Card className="bg-black/1 border-black/4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#e30101]" />
            <h2 className="text-xl font-semibold">Account</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-black/60">Wallet Address</Label>
            <div className="flex gap-2 mt-2">
              <Input 
                value={account || ''} 
                readOnly 
                className="bg-black/5 border-black/10 text-black font-mono"
              />
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(account)
                  toast.success('Address copied!')
                }}
                className="bg-black/10 hover:bg-black/20"
              >
                Copy
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-black/60">Network</Label>
            <Input 
              value="Avalanche C-Chain" 
              readOnly 
              className="bg-black/5 border-black/10 text-black mt-2"
            />
          </div>

          <Separator className="bg-black/10 my-5" />

          <Button 
            onClick={handleDisconnect}
            variant="destructive"
            className="w-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="bg-black/1 border-black/4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#e30101]" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-black">Email Notifications</p>
              <p className="text-sm text-black/60">Receive updates via email</p>
            </div>
            <button
              onClick={() => setNotifications({...notifications, email: !notifications.email})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications.email ? 'bg-[#e30101]' : 'bg-black/10'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.email ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <Separator className="bg-black/10" />

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-black">Transaction Alerts</p>
              <p className="text-sm text-black/60">Get notified of all transactions</p>
            </div>
            <button
              onClick={() => setNotifications({...notifications, transactions: !notifications.transactions})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications.transactions ? 'bg-[#e30101]' : 'bg-black/10'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.transactions ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <Separator className="bg-black/10" />

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-black">Price Alerts</p>
              <p className="text-sm text-black/60">Notify when price conditions are met</p>
            </div>
            <button
              onClick={() => setNotifications({...notifications, priceAlerts: !notifications.priceAlerts})}
              className={`w-12 h-6 rounded-full transition-colors ${
                notifications.priceAlerts ? 'bg-[#e30101]' : 'bg-black/10'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.priceAlerts ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <Button 
            onClick={handleSaveNotifications}
            className="w-full bg-[#e30101] hover:bg-[#c10101] mt-4"
          >
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="bg-black/1 border-black/4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#e30101]" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400 font-medium">✓ Wallet Connected Securely</p>
            <p className="text-sm text-black/40 mt-1">
              Your wallet is protected by blockchain cryptography
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-medium text-black">Security Features:</p>
            <ul className="space-y-1 text-sm text-black/60">
              <li>• Signature-based authentication</li>
              <li>• No passwords stored</li>
              <li>• Avalanche network only</li>
              <li>• JWT token expires in 7 days</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* App Version */}
      <div className="text-center text-black/40 text-sm">
        Avio v1.0.0 • Powered by Avalanche
      </div>
    </div>
  )
}