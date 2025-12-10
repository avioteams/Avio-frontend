// src/pages/ChatFlow.jsx
import { useState, useRef, useEffect } from 'react'
import { Send, Edit2, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { IconArrowAutofitLeftFilled, IconSettings } from '@tabler/icons-react'
import { api } from '@/services/api'
import { toast } from 'sonner'

export default function ChatFlow() {
  const navigate = useNavigate()
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

  // Parse user instruction with AI using API service
  const parseInstruction = async (instruction) => {
    setIsLoading(true)

    try {
      console.log('🤖 Parsing instruction:', instruction)
      
      // Call backend AI endpoint via API service
      const data = await api.parseInstruction(instruction)
      
      console.log('✅ AI parsed rule:', data.rule)
      return data.rule // { action, amount, condition, recipient }
      
    } catch (err) {
      console.error('❌ Parse error:', err)
      toast.error('Failed to parse instruction')
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

  // Handle rule confirmation using API service
  const handleConfirmRule = async () => {
    setIsConfirming(true)

    // Show saving progress
    setMessages(prev => [...prev, {
      type: 'progress',
      content: 'Saving rule...',
      timestamp: new Date()
    }])

    try {
      console.log('💾 Saving rule:', currentRule)

      // Step 1: Save rule to backend via API service
      const { ruleId } = await api.createRule(currentRule)
      
      console.log('✅ Rule saved with ID:', ruleId)

      // Update progress
      setMessages(prev => [...prev, {
        type: 'progress',
        content: 'Activating scheduler...',
        timestamp: new Date()
      }])

      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 2: Activate monitoring via API service
      await api.activateRule(ruleId)
      
      console.log('✅ Rule activated and monitoring started')

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
        content: '✓ Rule activated successfully!',
        ruleId: ruleId,
        timestamp: new Date()
      }])

      toast.success('Rule created and activated!')

      // Redirect to rule details after 2 seconds
      setTimeout(() => {
        navigate(`/rules/${ruleId}`)
      }, 2000)

    } catch (err) {
      console.error('❌ Confirmation error:', err)
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Failed to create rule. Please try again.',
        timestamp: new Date()
      }])
      toast.error('Failed to create rule')
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
    <div className='flex min-h-screen w-full bg-white'>
      {/* Sidebar */}
      <div className="flex flex-col w-68 border-r border-black/10 bg-white">
        <div className="p-4">
          <img src="/Logo.svg" className="w-28" alt="Avio Logo" />
        </div>
        
        <div className="flex flex-col gap-2 p-3">
          <Link to="/dashboard">
            <Button className="w-full justify-start bg-[#e30101] hover:bg-[#c10101] text-white">
              <IconArrowAutofitLeftFilled className="mr-2" />          
              Back to Dashboard
            </Button>
          </Link>
          
          <Link to="/dashboard/settings">
            <Button className="w-full justify-start bg-transparent hover:bg-black/5 text-black border border-black/10">
              <IconSettings className="mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        {/* Tips Section */}
        <div className="mt-auto p-4 border-black/10">
          <div className="bg-black/5 rounded-lg p-3">
            <h4 className="font-semibold text-sm text-black mb-2">💡 Quick Tips</h4>
            <ul className="text-xs text-black/60 space-y-1">
              <li>• "Send NGN10k if AVAX &lt; 30"</li>
              <li>• "Save NGN5k monthly"</li>
              <li>• "Escrow NGN50k for project"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 bg-white">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-[#e30101]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-[#e30101]" />
                </div>
                <h2 className="text-xl font-semibold text-black mb-2">Start a Conversation</h2>
                <p className="text-black/60 mb-4">Tell me what automation you'd like to create</p>
                <div className="space-y-2 text-sm text-black/50">
                  <p>Try: "Send NGN10k if AVAX &lt; 30"</p>
                  <p>Or: "Save NGN5,000 every month"</p>
                </div>
              </div>
            </div>
          )}

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
                  <div className="bg-black/5 border border-black/10 text-black px-4 py-3 rounded-2xl rounded-tl-sm max-w-md">
                    {message.content}
                  </div>
                </div>
              )}

              {/* Rule Preview */}
              {message.type === 'rule-preview' && (
                <div className="flex justify-start">
                  <div className="bg-black/5 border border-black/10 rounded-xl p-6 max-w-md w-full">
                    <h3 className="text-black font-semibold text-lg mb-4">Rule Preview</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-black/60 text-sm">Action</span>
                        <span className="text-black font-medium">{message.rule.action}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-black/60 text-sm">Amount</span>
                        <span className="text-black font-medium">{message.rule.amount}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-black/60 text-sm">Condition</span>
                        <span className="text-[#e30101] font-medium">{message.rule.condition}</span>
                      </div>

                      {message.rule.recipient && (
                        <div className="flex justify-between items-center">
                          <span className="text-black/60 text-sm">Recipient</span>
                          <span className="text-black font-mono text-sm">
                            {message.rule.recipient.slice(0, 6)}...{message.rule.recipient.slice(-4)}
                          </span>
                        </div>
                      )}

                      {!message.rule.recipient && (
                        <div className="pt-2">
                          <label className="text-black/60 text-sm block mb-2">Recipient Address</label>
                          <input 
                            type="text"
                            placeholder="0x..."
                            className="w-full bg-white border border-black/20 rounded-lg px-3 py-2 text-black text-sm focus:outline-none focus:ring-2 focus:ring-[#e30101]"
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
                        className="flex-1 bg-white hover:bg-black/5 text-black border border-black/20 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  <div className="bg-blue-500/10 border border-blue-500/30 text-blue-600 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {message.content}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {message.type === 'success' && (
                <div className="flex justify-start">
                  <div className="bg-green-500/10 border border-green-500/30 text-green-600 px-4 py-3 rounded-2xl rounded-tl-sm">
                    {message.content}
                    {message.ruleId && (
                      <div className="mt-2">
                        <Link 
                          to={`/rules/${message.ruleId}`}
                          className="text-sm underline hover:text-green-700"
                        >
                          View Rule Details →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {message.type === 'error' && (
                <div className="flex justify-start">
                  <div className="bg-red-500/10 border border-red-500/30 text-red-600 px-4 py-3 rounded-2xl rounded-tl-sm">
                    {message.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-black/5 border border-black/10 text-black px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#e30101]" />
                <span>Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-black/10 p-4 bg-white">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder='Try: "Send NGN10k if AVAX < 30"'
              disabled={isLoading || isConfirming}
              className="flex-1 bg-black/5 border border-black/10 rounded-full px-6 py-3 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#e30101] disabled:opacity-50"
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