import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import data from './data.json'

export default function DashboardPage() {
  // const navigate = useNavigate()
  // const { account, disconnect } = useWallet()
  const [rules, setRules] = useState([data])

  // // Fetch rules from backend
  // useEffect(() => {
  //   fetchRules()
  // }, [])

  // const fetchRules = async () => {
  //   try {
  //     const response = await fetch('/api/rules', {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  //       }
  //     })
  //     const data = await response.json()
  //     setRules(data.rules)
  //   } catch (err) {
  //     console.error('Failed to fetch rules:', err)
  //   }
  // }

  const activeRules = rules.filter(r => r.status === 'Active')
  const recentActivity = rules.filter(r => r.status === 'Executed').slice(0, 5)

  const getStatusBadge = (status) => {
    const styles = {
      Active: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
      Pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
      Executed: 'bg-green-400/10 text-green-400 border-green-400/30'
    }
    
    const icons = {
      Active: <Loader2 className="w-3 h-3 animate-spin" />,
      Pending: <Clock className="w-3 h-3" />,
      Executed: <CheckCircle className="w-3 h-3" />
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {status}
      </span>
    )
  }

  const getTypeColor = (type) => {
    const colors = {
      Savings: 'text-purple-400',
      Escrow: 'text-orange-400',
      Transfer: 'text-blue-400'
    }
    return colors[type] || 'text-white/60'
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-[#ffffff] text-white">
      {/* Wallet Balance Section */}
      <div className="bg-[#e30101] p-8 rounded-3xl mx-0 mt-0">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <p className="text-white/80 text-sm tracking-wide uppercase">Wallet Balance</p>
            <h1 className="text-6xl font-bold tracking-tight">NGN10,000</h1>
            <p className="text-white/60 text-sm">Avalanche Fuji Testnet</p>
            <Link to="fund">
              <Button className="mt-4 bg-secondary text-secondary-foreground hover:text-secondary px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition-colors">
                Add Funds
              </Button>
            </Link>
          </div>
          <div className="w-72 h-72 absolute right-12 top-16">
            <img src="../gold money bag.png" alt="" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 space-y-8 text-secondary">
        {/* Active Rules Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Active Rules</h2>
            <Button 
              onClick={() => window.location.href = '/chat'}
              className="text-[#ffffff] rounded-full bg-secondary text-sm font-medium hover:underline hover:text-secondary-foreground hover:bg-secondary"
            >
              View all
            </Button>
          </div>

          {activeRules.length === 0 ? (
            <div className="bg-black/5 border border-black/10 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-black/40" />
              </div>
              <p className="text-black/60 mb-2">No active automations</p>
              <p className="text-black/40 text-sm">Create one below to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeRules.map((rule) => (
                <a
                  key={rule.id}
                  href={`/rules/${rule.id}`}
                  className="block bg-black/5 border border-black/10 hover:bg-black/10 rounded-xl p-4 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-black font-medium mb-2 truncate">{rule.header}</p>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium ${getTypeColor(rule.type)}`}>
                          {rule.type}
                        </span>
                        <span className="text-black/40 text-xs">•</span>
                        <span className="text-black/40 text-xs">{formatTime(rule.time)}</span>
                      </div>
                    </div>
                    {getStatusBadge(rule.status)}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

          {recentActivity.length === 0 ? (
            <div className="bg-black/5 border border-black/10 rounded-2xl p-8 text-center">
              <p className="text-black/40 text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="bg-black/5 border border-black/10 rounded-2xl divide-y divide-black/10">
              {recentActivity.map((rule) => (
                <a
                  key={rule.id}
                  href={`/rules/${rule.id}`}
                  className="block p-4 hover:bg-black/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-black text-sm mb-1">{rule.header}</p>
                      <span className="text-black/40 text-xs">{formatTime(rule.time)}</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* All Rules Table */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">All Rules</h2>
            <button className="text-black/60 hover:text-black text-sm">
              Filter
            </button>
          </div>

          <div className="bg-black/5 border border-black/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/5">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-black/80">Action</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-black/80">Type</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-black/80">Status</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-black/80">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {rules.map((rule) => (
                    <tr 
                      key={rule.id}
                      onClick={() => window.location.href = `/rules/${rule.id}`}
                      className="hover:bg-black/5 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-4">
                        <p className="text-black text-sm">{rule.header}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-medium ${getTypeColor(rule.type)}`}>
                          {rule.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(rule.status)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-black/60 text-sm">{formatTime(rule.time)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <a
        href="/chat"
        className="fixed bottom-6 right-6 bg-[#e30101] hover:bg-[#c10101] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors group"
      >
        <Plus className="w-6 h-6" />
        <span className="sr-only">New Rule</span>
      </a>
    </div>
  )
}