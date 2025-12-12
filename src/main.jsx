import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WalletProvider } from '@/contexts/WalletContext'
import { Toaster } from 'sonner'
import './index.css'

// Components
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'
import Preloader from '@/components/Preloader'

// Pages
import Landing from '@/app/landing/LandingPage'
import DashboardPage from '@/app/dashboard/Dashboard'
import ChatFlow from '@/app/dashboard/chat/ChatFlow'
import RuleDetailsScreen from '@/app/dashboard/rule/RuleDetailsScreen'
// import TransactionReceiptScreen from '@/app/dashboard/chat/TransactionReceiptScreen'
import TestBackend from '@/app/TestBackend'
import ErrorPage from '@/app/ErrorPage'

// Dashboard sub-pages
import Transfer from '@/app/dashboard/transaction/Transfer'
import Escrow from '@/app/dashboard/escrow/Escrow'
import AddFunds from '@/app/dashboard/funding/AddFunds'
import Settings from '@/app/dashboard/settings/Settings'

function App() {
  const [preloader, setPreloader] = useState(true)

  return (
    <>
      {preloader && (
        <Preloader onLoadComplete={() => setPreloader(false)} />
      )}

      {/* Show main app after splash */}
      {!preloader && (
        <WalletProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="transfer" element={<Transfer />} />
                <Route path="escrow" element={<Escrow />} />
                <Route path="settings" element={<Settings />} />
                <Route path="fund" element={<AddFunds />} />
              </Route>

              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <ChatFlow />
                  </ProtectedRoute>
                } 
              />

              {/* Rule Details */}
              <Route 
                path="/rules/:ruleId" 
                element={
                  <ProtectedRoute>
                    <RuleDetailsScreen />
                  </ProtectedRoute>
                } 
              />

              {/* Receipt */}
              {/* <Route 
                path="/receipt/:txHash" 
                element={
                  <ProtectedRoute>
                    <TransactionReceiptScreen />
                  </ProtectedRoute>
                } 
              /> */}

              <Route path="/test" element={<TestBackend />} />

              <Route path="*" element={<ErrorPage />} />
            </Routes>

            <Toaster 
              position="top-right" 
              theme="dark"
              toastOptions={{
                style: {
                  background: '#121212',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#ffffff'
                },
                duration: 4000
              }}
            />
          </BrowserRouter>
        </WalletProvider>
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)