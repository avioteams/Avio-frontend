import { StrictMode } from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './pages/Layout'
import Overview from './pages/Overview'
import Credit from './pages/CreditDM'
import Savings from './pages/Savings'
import LandingLayout from './pages/landing/LandingLayout'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingLayout/>} />
        <Route exact path='/dashboard' element={<DashboardLayout />}>
          <Route path="" element={<Navigate to="home" replace />} />
          <Route path='home' element={<Overview />} />
          <Route path='home/transfer' element={<Credit />} />
          <Route path='home/deposit' element={<Savings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
