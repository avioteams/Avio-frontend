import { useState } from 'react'
import { api } from '@/services/api'
import { Button } from '@/components/ui/button'

export default function TestBackend() {
  const [result, setResult] = useState(null)

  const testHealth = async () => {
    try {
      const data = await api.healthCheck()
      setResult(JSON.stringify(data, null, 2))
    } catch (err) {
      setResult('Error: ' + err.message)
    }
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
      <Button onClick={testHealth} className="bg-[#e30101] mb-4">
        Test Health Endpoint
      </Button>
      {result && (
        <pre className="bg-white/5 p-4 rounded-lg overflow-auto">
          {result}
        </pre>
      )}
    </div>
  )
}