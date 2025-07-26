
import React, { useEffect, useState } from 'react'

// --- Constants ---
const CONTAINER_ID = 'akool-avatar-container'
const AKOOL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2RlYTg5ZDY0MThiM2VmY2MxNzM5YiIsInVpZCI6MTUyOTEyODMsImVtYWlsIjoibm92YWRlc2lnbnNjb250YWN0QGdtYWlsLmNvbSIsImNyZWRlbnRpYWxJZCI6IjY4N2Y0NTAwOWY0MWNiYTY2ZDFmNmEyNSIsImZpcnN0TmFtZSI6Im5vdmEgZGVzaWducyIsImxhc3ROYW1lIjoiY29udGFjdCIsInRlYW1faWQiOiI2ODdkZWE4OWJiNTI1OWIxOTg2MGQ5ZWQiLCJyb2xlX2FjdGlvbnMiOlsxLDIsMyw0LDUsNiw3LDgsOV0sImlzX2RlZmF1bHRfdGVhbSI6dHJ1ZSwiY2hhbm5lbCI6MTAwMDAsImZyb20iOiJ0b08iLCJ0eXBlIjoidXNlciIsImlhdCI6MTc1MzQyMzQzNywiZXhwIjoyMDY0NDYzNDM3fQ.oswIbnfcc-kRUH0hBejEShhotOKn0Wyg58NxncmkPjk' // Replace with your actual token
const AVATAR_ID = 'dvp_Tristan_cloth2_1080P'
const AKOOL_SDK_URL = 'https://cdn.jsdelivr.net/gh/pigmore/docs/streamingAvatar-min.js'
const AKOOL_SDK_SCRIPT_ID = 'akool-streaming-avatar-sdk'

// --- Main Component ---
function StreamingAvatar() {
  // State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionStarted, setSessionStarted] = useState(false)

  // Load Akool SDK script 
  useEffect(() => {
    if (!document.getElementById(AKOOL_SDK_SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = AKOOL_SDK_SCRIPT_ID
      script.src = AKOOL_SDK_URL
      script.async = true
      script.onload = () => console.log('✅ Akool SDK loaded')
      script.onerror = () => {
        console.error('❌ Failed to load Akool SDK')
        setError('Failed to load Akool SDK. Please refresh the page.')
      }
      document.body.appendChild(script)
    }
  }, [])

  // Start a new avatar session
  const handleCreateSession = async () => {
    setLoading(true)
    setError('')
    try {
      // 1. Create session via Akool API
      const response = await fetch('https://openapi.akool.com/api/open/v4/liveAvatar/session/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AKOOL_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar_id: AVATAR_ID }),
      })
      const result = await response.json()
      console.log('📡 Session Response:', result)

      // 2. If session created, initialize the avatar
      if (result.code === 1000) {
        // Wait for SDK to be ready (optional, for safety)
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (window.StreamingAvatar) {
          const avatar = new window.StreamingAvatar({ token: AKOOL_TOKEN })
          avatar.initDom(CONTAINER_ID)
          setSessionStarted(true)
        } else {
          setError('Avatar SDK not loaded. Please refresh the page.')
        }
      } else {
        setError(`Session Error: ${result.msg || 'Failed to create session'}`)
      }
    } catch (err) {
      setError(`Failed to create session: ${err.message}`)
    }
    setLoading(false)
  }

  // --- Render ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Akool Streaming Avatar Demo</h2>

      {/* Error message */}
      {error && (
        <div className="mb-2 px-4 py-2 bg-red-100 text-red-700 rounded">
          ❌ {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="mb-2 text-gray-500">🔄 Loading...</div>
      )}

      {/* Start session button */}
      <div className="mb-4">
        <button
          onClick={handleCreateSession}
          disabled={loading}
          className={`px-6 py-2 rounded text-white font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating Session...' : 'Start Avatar Session'}
        </button>
      </div>

      {/* Avatar container. Do not render children after session starts. */}
      <div
        id={CONTAINER_ID}
        className="w-[640px] h-[480px] border border-gray-300 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-base relative"
      >
        {!sessionStarted && !loading && (
          <div className="text-center">
            👆 Click "Start Avatar Session" to begin
            <br />
            <span className="text-xs text-gray-400">Check console (F12) for detailed logs</span>
          </div>
        )}
        {!sessionStarted && loading && (
          <div className="text-center">
            🔄 Initializing avatar...
            <br />
            <span className="text-xs text-gray-400">This may take a few seconds</span>
          </div>
        )}
        {/* Once session starts*/}
      </div>
    </div>
  )
}

export default StreamingAvatar
