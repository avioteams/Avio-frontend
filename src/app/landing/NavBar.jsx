import { NavLink } from "react-router-dom";
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IconMenu2, IconX } from "@tabler/icons-react"
import WalletModal from '@/components/WalletModal'

gsap.registerPlugin(ScrollTrigger)

export default function NavBar() {
  const navRef = useRef(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  const QuickLinks = [
    { link: "Why Avio", to: "/aboutus" }, 
    { link: "Features", to: "/features" }, 
    { link: "Customer Support", to: "/customer" }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {
          className: 'navbar-scrolled',
          targets: navRef.current
        }
      })

      gsap.to(navRef.current, {
        scrollTrigger: {
          start: 'top -80',
          end: 99999,
          toggleActions: 'play none none reverse'
        },
        backdropFilter: 'blur(10px)',
        paddingTop: '12px',
        paddingBottom: '12px',
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    return () => ctx.revert()
  }, [])

  const handleWalletClick = () => {
    setShowWalletModal(true)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 right-0 px-4 sm:px-6 md:px-12 lg:px-20 py-4 md:py-6 z-50 transition-all duration-300"
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <section className="logo">
            <img src="../Logo.svg" alt="Avio Logo" className="w-16 sm:w-20 md:w-[100px]" />
          </section>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <section className="links hidden lg:block">
            <ul className="flex list-none gap-6 xl:gap-12">
              {QuickLinks.map((quicklink, index) => (
                <li key={index}>
                  <NavLink 
                    className={({ isActive }) => 
                      `no-underline font-semibold transition-all ${
                        isActive 
                          ? 'bg-[#e30101] text-white px-6 xl:px-9 py-3 xl:py-3.5 rounded-full' 
                          : 'text-white hover:text-[#e30101]'
                      }`
                    }
                    aria-current="page"
                    end
                    to={quicklink.to}
                  >
                    {quicklink.link}
                  </NavLink>
                </li>
              ))}
            </ul>
          </section>

          {/* Desktop Quick Actions - Hidden on mobile/tablet */}
          <section className="hidden lg:flex gap-2">
            <Button 
              className="text-secondary bg-secondary-foreground rounded-full px-5 xl:px-7 py-4 xl:py-5 hover:scale-105 transition-transform text-sm xl:text-base"
              onClick={handleWalletClick}
            >
              Login
            </Button>
            <Button 
              className="bg-[#e30101] text-white rounded-full px-5 xl:px-7 py-4 xl:py-5 hover:scale-105 hover:shadow-[0_0_20px_rgba(227,1,1,0.4)] transition-all text-sm xl:text-base"
              onClick={handleWalletClick}
            >
              Connect Wallet
            </Button>
          </section>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-[#121212]/98 backdrop-blur-lg border-t border-white/10 p-6 space-y-4 animate-in slide-in-from-top duration-200">
            <ul className="space-y-3">
              {QuickLinks.map((quicklink, index) => (
                <li key={index}>
                  <NavLink 
                    className={({ isActive }) => 
                      `block font-semibold py-2 transition-colors ${
                        isActive 
                          ? 'text-[#e30101]' 
                          : 'text-white hover:text-[#e30101]'
                      }`
                    }
                    aria-current="page"
                    end
                    to={quicklink.to}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {quicklink.link}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              <Button 
                className="text-secondary bg-secondary-foreground rounded-full w-full py-5"
                onClick={handleWalletClick}
              >
                Login
              </Button>
              <Button 
                className="bg-[#e30101] hover:bg-[#c10101] text-white rounded-full w-full py-5 hover:shadow-[0_0_20px_rgba(227,1,1,0.4)] transition-all"
                onClick={handleWalletClick}
              >
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* WalletModal */}
      <WalletModal 
        open={showWalletModal} 
        onClose={() => setShowWalletModal(false)} 
      />
    </>
  )
}