// src/pages/RuleDetailsScreen.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, CheckCircle, Clock, Activity, AlertCircle } from 'lucide-react'
import { api } from '@/services/api'
import { toast } from 'sonner'

export default function RuleDetailsScreen() {
  const { ruleId } = useParams()
  const navigate = useNavigate()
  const [rule, setRule] = useState(null)
  const [priceData, setPriceData] = useState(null)
  const [executionLog, setExecutionLog] = useState([])
  const [showTriggerPopup, setShowTriggerPopup] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch rule data on mount
  useEffect(() => {
    fetchRuleDetails()
  }, [ruleId])

  // Poll for price updates every 3 seconds
  useEffect(() => {
    if (!rule || rule.status === 'executed') return

    const interval = setInterval(() => {
      fetchPriceUpdate()
    }, 3000)

    return () => clearInterval(interval)
  }, [rule])

  const fetchRuleDetails = async () => {
    try {
      setLoading(true)
      console.log('📋 Fetching rule details:', ruleId)
      
      const data = await api.getRuleDetails(ruleId)
      setRule(data.rule)
      setExecutionLog(data.executionLog || [])
      
      console.log('✅ Rule loaded:', data.rule)
    } catch (err) {
      console.error('❌ Failed to fetch rule:', err)
      toast.error('Failed to load rule details')
    } finally {
      setLoading(false)
    }
  }

  const fetchPriceUpdate = async () => {
    try {
      const data = await api.getRulePrice(ruleId)
      setPriceData(data)

      // Check if condition triggered
      if (data.conditionMet && rule.status === 'active') {
        handleRuleTriggered(data)
      }
    } catch (err) {
      console.error('Failed to fetch price:', err)
    }
  }

  const handleRuleTriggered = async (triggerData) => {
    setShowTriggerPopup(true)
    setIsExecuting(true)

    // Add log entries
    const logs = [
      {
        type: 'price',
        message: `${triggerData.asset} price dropped to ${triggerData.currentPrice}`,
        timestamp: new Date()
      },
      {
        type: 'condition',
        message: 'Condition met',
        timestamp: new Date()
      },
      {
        type: 'executing',
        message: 'Executing transaction...',
        timestamp: new Date()
      }
    ]

    for (const log of logs) {
      setExecutionLog(prev => [...prev, log])
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Execute transaction
    try {
      const data = await api.executeRule(ruleId)

      // Add transaction logs
      setExecutionLog(prev => [
        ...prev,
        {
          type: 'transaction',
          message: `Transaction sent: ${data.txHash}`,
          txHash: data.txHash,
          timestamp: new Date()
        },
        {
          type: 'confirmed',
          message: 'Confirmed on Avalanche',
          timestamp: new Date()
        },
        {
          type: 'success',
          message: `${rule.amount} sent successfully`,
          timestamp: new Date()
        }
      ])

      // Update rule status
      setRule(prev => ({ ...prev, status: 'executed', txHash: data.txHash }))
      setIsExecuting(false)
      toast.success('Rule executed successfully!')

    } catch (err) {
      console.error('Execution failed:', err)
      setExecutionLog(prev => [
        ...prev,
        {
          type: 'error',
          message: 'Transaction failed',
          timestamp: new Date()
        }
      ])
      setIsExecuting(false)
      toast.error('Execution failed')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
      case 'executed': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-black/60 bg-black/5 border-black/10'
    }
  }

  const parseCondition = (condition) => {
    const match = condition.match(/(\w+)\s*([<>]=?)\s*([\d.]+)/)
    if (match) {
      return {
        asset: match[1],
        operator: match[2],
        threshold: parseFloat(match[3])
      }
    }
    return null
  }

  const checkConditionMet = () => {
    if (!priceData || !rule) return false
    const parsed = parseCondition(rule.condition)
    if (!parsed) return false

    switch (parsed.operator) {
      case '<': return priceData.currentPrice < parsed.threshold
      case '>': return priceData.currentPrice > parsed.threshold
      case '<=': return priceData.currentPrice <= parsed.threshold
      case '>=': return priceData.currentPrice >= parsed.threshold
      default: return false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-[#e30101] mx-auto mb-4" />
          <p className="text-black/60">Loading rule details...</p>
        </div>
      </div>
    )
  }

  if (!rule) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-black/60 mb-4">Rule not found</p>
          <Link to="/dashboard">
            <button className="text-[#e30101] underline">Back to Dashboard</button>
          </Link>
        </div>
      </div>
    )
  }

  const conditionMet = checkConditionMet()
  const timeSinceUpdate = priceData ? Math.floor((Date.now() - new Date(priceData.timestamp).getTime()) / 1000) : 0

  return (
    <div className="min-h-screen bg-white text-black p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-black/60 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Rule Summary */}
        <div className="bg-white border border-black/10 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{rule.action} Rule</h1>
              <p className="text-black/60">"{rule.condition}"</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(rule.status)}`}>
              {rule.status.charAt(0).toUpperCase() + rule.status.slice(1)}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-black/5 rounded-lg p-4">
              <p className="text-black/60 text-sm mb-1">Amount</p>
              <p className="text-xl font-bold">{rule.amount}</p>
            </div>
            <div className="bg-black/5 rounded-lg p-4">
              <p className="text-black/60 text-sm mb-1">Recipient</p>
              <p className="text-sm font-mono">
                {rule.recipient.slice(0, 6)}...{rule.recipient.slice(-4)}
              </p>
            </div>
            <div className="bg-black/5 rounded-lg p-4">
              <p className="text-black/60 text-sm mb-1">Created</p>
              <p className="text-sm">{new Date(rule.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Status Box */}
        {rule.status === 'active' && (
          <div className="bg-white border border-black/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Monitoring Status</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black/60">Next check</span>
                <span className="text-black font-medium">in {3 - timeSinceUpdate}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black/60">Last updated</span>
                <span className="text-black font-medium">{timeSinceUpdate}s ago</span>
              </div>
            </div>
          </div>
        )}

        {/* Condition Monitor */}
        {rule.status === 'active' && priceData && (
          <div className="bg-white border border-black/10 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Condition Monitor</h2>
            
            <div className="space-y-4">
              <div className="bg-black/5 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-black/60">Oracle Price</span>
                  <span className="text-2xl font-bold text-[#e30101]">
                    ${priceData.currentPrice}
                  </span>
                </div>
              </div>

              <div className="bg-black/5 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-black/60">Trigger Condition</span>
                  <span className="font-medium">{rule.condition}</span>
                </div>
              </div>

              <div className="bg-black/5 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-black/60">Status</span>
                  <span className={`font-semibold ${conditionMet ? 'text-green-400' : 'text-black/60'}`}>
                    {conditionMet ? '✓ Met' : 'Not met'}
                  </span>
                </div>
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 mt-4 text-sm text-black/60">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Updates every 3 seconds
            </div>
          </div>
        )}

        {/* Execution Log */}
        <div className="bg-white border border-black/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Execution Log</h2>
          
          {executionLog.length === 0 ? (
            <div className="text-center py-12 text-black/40">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No execution events yet</p>
              <p className="text-sm mt-1">Waiting for condition to be met...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {executionLog.map((log, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 bg-black/5 rounded-lg p-4"
                >
                  {/* Icon */}
                  <div className="mt-0.5">
                    {log.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                    {log.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                    {log.type === 'executing' && <Activity className="w-5 h-5 text-blue-400 animate-pulse" />}
                    {!['success', 'error', 'executing'].includes(log.type) && (
                      <div className="w-5 h-5 rounded-full border-2 border-black/20" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-black">{log.message}</p>
                    {log.txHash && (
                      <a 
                        href={`https://snowtrace.io/tx/${log.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#e30101] hover:underline flex items-center gap-1 mt-1"
                      >
                        View on Snowtrace
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <p className="text-xs text-black/40 mt-1">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction Receipt Link */}
        {rule.status === 'executed' && rule.txHash && (
          <div className="mt-6">
            <Link to={`/receipt/${rule.txHash}`}>
              <button className="w-full bg-[#e30101] hover:bg-[#c10101] text-white py-3 rounded-lg font-semibold transition-colors">
                View Transaction Receipt
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Trigger Popup */}
      {showTriggerPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white border border-[#e30101] rounded-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e30101]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-[#e30101] animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-black">Rule Triggered!</h2>
              <p className="text-black/60 mb-6">
                Condition met. Executing transaction...
              </p>
              {isExecuting && (
                <div className="flex items-center justify-center gap-2 text-sm text-black/60">
                  <div className="w-4 h-4 border-2 border-[#e30101]/30 border-t-[#e30101] rounded-full animate-spin" />
                  Processing...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}