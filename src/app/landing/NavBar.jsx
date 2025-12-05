import { NavLink } from "react-router-dom";
import { Button } from '@/components/ui/button'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function NavBar() {
  const navRef = useRef(null)

  const QuickLinks = [
    {
      link: "Why Avio",
      to: "/aboutus"
    }, 
    {
      link: "Features",
      to: "/features"
    }, 
    {
      link: "Customer Support",
      to: "/customer"
    }
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar scroll animation
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {
          className: 'navbar-scrolled',
          targets: navRef.current
        }
      })

      // Smooth background and padding transition on scroll
      gsap.to(navRef.current, {
        scrollTrigger: {
          start: 'top -80',
          end: 99999,
          toggleActions: 'play none none reverse'
        },
        backgroundColor: 'rgba(18, 18, 18, 0.95)',
        backdropFilter: 'blur(10px)',
        paddingTop: '12px',
        paddingBottom: '12px',
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <nav 
      ref={navRef}
      className="fixed top-0 left-0 right-0 px-6 md:px-20 py-6 z-50 transition-all duration-300"
    >
      <div className="flex justify-between items-center">
        {/* Logo Section */}
        <section className="logo">
          <img src="../Logo.svg" alt="Avio Logo" className="w-20 md:w-[100px]" />
        </section>

        {/* Navigation Links */}
        <section className="links hidden md:block">
          <ul className="flex list-none gap-8 md:gap-12">
            {QuickLinks.map((quicklink, index) => (
              <li key={index}>
                <NavLink 
                  className={({ isActive }) => 
                    `no-underline font-semibold transition-all ${
                      isActive 
                        ? 'bg-[#e30101] text-white px-9 py-3.5 rounded-full' 
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

        {/* Quick Actions */}
        <section className="flex gap-2">
          <Button className="text-secondary bg-secondary-foreground rounded-full px-7 py-5 hover:scale-105 transition-transform">
            Login
          </Button>
          <Button className="bg-[#e30101] text-white rounded-full px-7 py-5 hover:scale-105 hover:shadow-[0_0_20px_rgba(227,1,1,0.4)] transition-all">
            Connect Wallet
          </Button>
        </section>
      </div>
    </nav>
  )
}