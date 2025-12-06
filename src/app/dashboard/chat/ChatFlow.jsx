import { useState, useRef, useEffect } from 'react'
import { Send, Edit2, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { IconArrowAutofitLeftFilled, IconSettings } from '@tabler/icons-react'

export default function ChatFlow() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentRule, setCurrentRule] = useState(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Parse user instruction with AI
  const parseInstruction = async (instruction) => {
    setIsLoading(true)

    try {
      // Call backend AI endpoint
      const response = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ instruction })
      })

      const data = await response.json()
      return data.rule // { action, amount, condition, recipient }
    } catch (err) {
      console.error('Parse error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Handle user message submission
  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')

    // Add user message to chat
    setMessages(prev => [...prev, {
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }])

    // Parse with AI
    const parsedRule = await parseInstruction(userMessage)

    if (parsedRule) {
      // Add AI response
      setMessages(prev => [...prev, {
        type: 'ai',
        content: "Sure, here's what I understood:",
        timestamp: new Date()
      }])

      // Add rule preview
      setMessages(prev => [...prev, {
        type: 'rule-preview',
        rule: parsedRule,
        timestamp: new Date()
      }])

      setCurrentRule(parsedRule)
    } else {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: "Sorry, I couldn't understand that. Can you try rephrasing?",
        timestamp: new Date()
      }])
    }
  }

  // Handle rule confirmation
  const handleConfirmRule = async () => {
    setIsConfirming(true)

    // Show saving progress
    setMessages(prev => [...prev, {
      type: 'progress',
      content: 'Saving rule...',
      timestamp: new Date()
    }])

    try {
      // Step 1: Save rule to backend
      const saveResponse = await fetch('/api/rules/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(currentRule)
      })

      const { ruleId } = await saveResponse.json()

      // Update progress
      setMessages(prev => [...prev, {
        type: 'progress',
        content: 'Activating scheduler...',
        timestamp: new Date()
      }])

      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 2: Activate monitoring
      await fetch(`/api/rules/${ruleId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      // Update progress
      setMessages(prev => [...prev, {
        type: 'progress',
        content: `Monitoring ${currentRule.condition.split(' ')[0]} price...`,
        timestamp: new Date()
      }])

      await new Promise(resolve => setTimeout(resolve, 1000))

      // Success message
      setMessages(prev => [...prev, {
        type: 'success',
        content: 'Rule activated successfully!',
        ruleId: ruleId,
        timestamp: new Date()
      }])

    } catch (err) {
      console.error('Confirmation error:', err)
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to create rule. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsConfirming(false)
    }
  }

  // Handle rule editing
  const handleEditRule = () => {
    setMessages(prev => [...prev, {
      type: 'ai',
      content: "What would you like to change?",
      timestamp: new Date()
    }])
  } 

  return (
    <div className='flex min-h-screen w-full'>
      <div className="flex flex-col w-68 border hover:bg-[#ffffff] group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh shrink-0">
        <img src="./Logo.svg" className="w-28 mt-2 mb-2 mx-3" alt="" />
        <Link to="/dashboard" className='w-full p-2'>
          <Button className="w-full mt-3">
            <IconArrowAutofitLeftFilled />          
            Back
          </Button>
        </Link>
        <Link to="/dashboard/settings" className='w-full px-2'>
          <Button className="text-secondary bg-[#ffffff] w-full">
            <IconSettings/>
            Settings
          </Button>
        </Link>
      </div>
      <div className="flex flex-col w-screen h-screen bg-[#ffffff]">
        <div className="flex items-center gap-2 border-y px-6 py-1">
          <div>
            <h1 className='font-normal text-2xl'>Create Automation</h1>
            <p className='font-normal text-xs text-black/40'>Type anything you want AVIO to do</p>
          </div>
        </div>
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div key={index}>
              {/* User Message */}
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="bg-[#e30101] text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-md">
                    {message.content}
                  </div>
                </div>
              )}

              {/* AI Message */}
              {message.type === 'ai' && (
                <div className="flex justify-start">
                  <div className="bg-[#121212] border text-[#ffffff] px-4 py-3 rounded-2xl rounded-tl-sm max-w-md">
                    {message.content}
                  </div>
                </div>
              )}

              {/* Rule Preview */}
              {message.type === 'rule-preview' && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-w-md w-full">
                    <h3 className="text-white font-semibold text-lg mb-4">Rule Preview</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Action</span>
                        <span className="text-white font-medium">{message.rule.action}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Amount</span>
                        <span className="text-white font-medium">{message.rule.amount}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-white/60 text-sm">Condition</span>
                        <span className="text-[#e30101] font-medium">{message.rule.condition}</span>
                      </div>

                      {message.rule.recipient && (
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-sm">Recipient</span>
                          <span className="text-white font-mono text-sm">
                            {message.rule.recipient.slice(0, 6)}...{message.rule.recipient.slice(-4)}
                          </span>
                        </div>
                      )}

                      {!message.rule.recipient && (
                        <div className="pt-2">
                          <label className="text-white/60 text-sm block mb-2">Recipient Address</label>
                          <input 
                            type="text"
                            placeholder="0x..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#e30101]"
                            onChange={(e) => setCurrentRule({...currentRule, recipient: e.target.value})}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={handleConfirmRule}
                        disabled={isConfirming || !currentRule?.recipient}
                        className="flex-1 bg-[#e30101] hover:bg-[#c10101] text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isConfirming ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Confirm
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleEditRule}
                        disabled={isConfirming}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Messages */}
              {message.type === 'progress' && (
                <div className="flex justify-start">
                  <div className="bg-white/5 text-white px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#e30101]" />
                    {message.content}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {message.type === 'success' && (
                <div className="flex justify-start">
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-2xl rounded-tl-sm">
                    {message.content}
                    {message.ruleId && (
                      <div className="mt-2">
                        <a 
                          href={`/rules/${message.ruleId}`}
                          className="text-sm underline hover:text-green-300"
                        >
                          View Rule Details
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {message.type === 'error' && (
                <div className="flex justify-start">
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl rounded-tl-sm">
                    {message.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 text-white px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#e30101]" />
                <span>Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border p-4 bg-[#fffff]">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder='Try: "Send NGN10k if AVAX < 30"'
              disabled={isLoading || isConfirming}
              className="flex-1 bg-[#121212]/7 border rounded-full px-6 py-3 text-[#121212] placeholder:text-[#121212]/40 focus:outline-none focus:ring-2 focus:ring-[#e30101] disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || isConfirming || !input.trim()}
              className="bg-[#e30101] hover:bg-[#c10101] text-white rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}