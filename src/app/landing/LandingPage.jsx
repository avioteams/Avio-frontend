import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import NavBar from "./NavBar"
import Footer from "./Footer"
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { IconWallet } from "@tabler/icons-react"
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WalletModal from '@/components/WalletModal'
import { useWallet } from '@/contexts/WalletContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

gsap.registerPlugin(ScrollTrigger)

export default function Landing() {
  const { isConnected } = useWallet()
  const navigate = useNavigate()
  const [showWalletModal, setShowWalletModal] = useState(false)

  // Mouse(Cursor as Scroll) movement animation
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  // Refs for animations
  const heroTextRef = useRef(null)
  const heroImageRef = useRef(null)
  const heroBtnsRef = useRef(null)
  const badgeRef = useRef(null)
  const targetRef = useRef(null)
  const featuresRef = useRef([])
  const highlightsRef = useRef(null)
  const gridRef = useRef(null)
  const cursorRef = useRef(null)
  const glowRef = useRef(null)

  // To check if users wallet is connect to Avio
  const handleGetStarted = () => {
    if (isConnected) {
      navigate('/dashboard')
    } else {
      setShowWalletModal(true)
    }
  }
  

  // Mouse tracking for parallax and custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: "power2.out"
        })
      }

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: e.clientX - 200,
          y: e.clientY - 200,
          duration: 0.5,
          ease: "power2.out"
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Main GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animated grid background
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          backgroundPosition: "100% 100%",
          duration: 20,
          repeat: -1,
          ease: "none"
        })
      }

      // Badge entrance with glitch
      const tl = gsap.timeline()
      tl.from(badgeRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }).to(badgeRef.current, {
        x: -2,
        duration: 0.05,
        repeat: 3,
        yoyo: true
      })

      // Hero text animation
      gsap.from(heroTextRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power4.out"
      })

      // Glitch effect on hero text
      const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 5 })
      glitchTl.to(heroTextRef.current, {
        x: -3,
        duration: 0.05,
        repeat: 2,
        yoyo: true,
        ease: "none"
      })

      // Hero image with 3D effect
      gsap.from(heroImageRef.current, {
        scale: 0.9,
        opacity: 0,
        rotationY: -15,
        duration: 1.5,
        delay: 0.5,
        ease: "back.out(1.4)"
      })

      // Floating animation for hero image
      gsap.to(heroImageRef.current, {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      // Buttons entrance
      // gsap.from(heroBtnsRef.current.children, {
      //   scale: 0,
      //   opacity: 0,
      //   duration: 1,
      //   delay: 0.3,
      //   stagger: 0.15,
      //   ease: "elastic.out(1, 0.5)"
      // })

      // Target audience reveal
      gsap.from(targetRef.current, {
        scrollTrigger: {
          trigger: targetRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          scrub: 1
        },
        y: 100,
        opacity: 0,
        scale: 0.95
      })

      // Features with 3D card flip
      featuresRef.current.forEach((feature, i) => {
        if (!feature) return
        
        const isEven = i % 2 === 0
        
        gsap.from(feature, {
          scrollTrigger: {
            trigger: feature,
            start: "top 75%",
            toggleActions: "play none none reverse"
          },
          x: isEven ? -150 : 150,
          opacity: 0,
          rotationY: isEven ? -20 : 20,
          duration: 1.2,
          ease: "power3.out"
        })

        // Parallax on scroll for images
        const img = feature.querySelector('img')
        if (img) {
          gsap.to(img, {
            scrollTrigger: {
              trigger: feature,
              start: "top bottom",
              end: "bottom top",
              scrub: 2
            },
            y: isEven ? 60 : -60,
            rotation: isEven ? 3 : -3,
            ease: "none"
          })
        }
      })

      // Highlight cards animation
      if (highlightsRef.current) {
        const cards = highlightsRef.current.querySelectorAll('.card')
        
        gsap.from(cards, {
          scrollTrigger: {
            trigger: highlightsRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          },
          y: 150,
          opacity: 0,
          rotation: 15,
          stagger: 0.2,
          duration: 1.2,
          ease: "back.out(1.7)"
        })

        // Continuous floating with different speeds
        cards.forEach((card, i) => {
          gsap.to(card, {
            y: i % 2 === 0 ? -20 : 20,
            rotation: i % 2 === 0 ? 3 : -3,
            duration: 3 + i,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.3
          })

          // Scale on hover
          card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.05, duration: 0.4, ease: "power2.out" })
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(card, { scale: 1, duration: 0.4, ease: "power2.out" })
          })
        })
      }
    })

    return () => ctx.revert()
  }, [])

  // Magnetic button effect
  const handleMagneticMove = (e) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    gsap.to(button, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const handleMagneticLeave = (e) => {
    gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    })
  }

  // Parallax effect for hero image
  useEffect(() => {
    if (heroImageRef.current) {
      const parallaxStrength = 30
      gsap.to(heroImageRef.current, {
        x: (mousePos.x - window.innerWidth / 2) / parallaxStrength,
        y: (mousePos.y - window.innerHeight / 2) / parallaxStrength,
        duration: 0.5,
        ease: "power2.out"
      })
    }
  }, [mousePos])

  return (
    <div className="landing relative overflow-hidden m-0 p-0 box-border">
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className="fixed w-4 h-4 bg-[#e30101] rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Ambient Glow */}
      <div 
        ref={glowRef}
        className="fixed w-96 h-96 bg-gradient-radial from-[#e30101]/20 to-transparent rounded-full blur-3xl pointer-events-none z-0"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Animated Grid Background */}
      <div 
        ref={gridRef}
        className="fixed inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(227, 1, 1, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(227, 1, 1, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0'
        }}
      />

      <NavBar />
      
      {/* Main Container */}
      <div className="grid gap-12 mt-8 px-6 md:px-[120px] py-6 relative z-10">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center gap-12 text-center mt-6">
          <div className="grid gap-6">
            <div className="flex flex-col items-center gap-6">
              <p 
                ref={badgeRef} 
                className="badge text-lg inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              >
                Powered by <span className="text-[#e30101] font-semibold">Avalanche</span>
                <span className="w-2 h-2 bg-[#e30101] rounded-full animate-pulse" />
              </p>
              
              <h1 
                ref={heroTextRef} 
                className="text-6xl md:text-[90px] font-semibold leading-tight md:leading-[110px]"
              >
                Automate your <br />
                <span className="text-[#e30101]">Crypto</span> like Magic
              </h1>
            </div>
            
            <div className="flex gap-1.5 justify-center mt-2">
              {/* ref={heroBtnsRef} */}
              <Button 
                className="bg-[#e30101] text-white px-12 py-[18px] text-base rounded-full font-bold hover:shadow-[0_0_30px_rgba(227,1,1,0.5)] transition-all relative overflow-hidden group"
                // onMouseMove={handleMagneticMove}
                // onMouseLeave={handleMagneticLeave}
                onClick={handleGetStarted}
                >
                <span className="relative z-10">{isConnected ? 'Go to Dashboard' : 'Begin an Experience'}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </Button>
              
              <Button 
                className="bg-secondary/10 text-white p-4 rounded-full border border-white/20 hover:border-[#e30101] hover:shadow-[0_0_20px_rgba(227,1,1,0.3)] transition-all"
                onClick={() => setShowWalletModal(true)}
                // onMouseMove={handleMagneticMove}
                // onMouseLeave={handleMagneticLeave}
              >
                <IconWallet size={24} />
              </Button>

              <WalletModal 
                open={showWalletModal} 
                onClose={() => setShowWalletModal(false)} 
              />
            </div>
          </div>
          
          <div ref={heroImageRef} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e30101]/20 to-transparent blur-3xl" />
            <img 
              src="../Black folding wallet.png" 
              alt="Crypto Wallet" 
              className="relative z-10 w-full md:w-[550px] drop-shadow-2xl" 
            />
          </div>
        </section>

        {/* Target Audience Section */}
        <section ref={targetRef} className="py-3 leading-[72px]">
          <p className="text-[#e30101] text-lg font-bold uppercase tracking-wider">For you</p>
          <p className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight md:leading-[72px] mt-4 max-w-7xl">
            Whether it's a friend, a vendor, or a creator, sending money is now as{' '}
            <span className="text-[#e30101]">easy</span> as sending a message
          </p>
          <div className="bg-[#e30101] mt-[90px] h-[70vh] rounded-[36px]" />
        </section>

        {/* Features Section */}
        <section className="space-y-[60px]">
          {/* Feature 1 */}
          <div 
            ref={el => featuresRef.current[0] = el} 
            className="flex flex-col md:flex-row items-center gap-[60px] mb-[60px]"
          >
            <img 
              src="../CreditCards.svg" 
              alt="Credit Cards" 
              className="w-full md:w-[450px] drop-shadow-2xl" 
            />
            <div className="flex-1 leading-[60px]">
              <p className="text-[#e30101] text-sm font-normal uppercase tracking-wider">For you</p>
              <p className="text-4xl md:text-5xl font-normal mt-4 leading-tight md:leading-[60px]">
                It's a New Wave of Social Money
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div 
            ref={el => featuresRef.current[1] = el} 
            className="flex flex-col md:flex-row-reverse items-center gap-[60px] mb-[60px]"
          >
            <img 
              src="../WalletOnCard.svg" 
              alt="Wallet" 
              className="w-full md:w-[450px] drop-shadow-2xl" 
            />
            <div className="flex-1 leading-[60px]">
              <p className="text-[#e30101] text-sm font-normal uppercase tracking-wider">Savings</p>
              <p className="text-4xl md:text-5xl font-normal mt-4 leading-tight md:leading-[60px]">
                Smart Savings That Actually Save You
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div 
            ref={el => featuresRef.current[2] = el} 
            className="flex flex-col md:flex-row items-center gap-[60px] mb-[60px]"
          >
            <img 
              src="../Escrow.svg" 
              alt="Escrow" 
              className="w-full md:w-[450px] drop-shadow-2xl" 
            />
            <div className="flex-1 leading-[60px]">
              <p className="text-[#e30101] text-sm font-normal uppercase tracking-wider">Creating Agreements</p>
              <p className="text-4xl md:text-5xl font-normal mt-4 leading-tight md:leading-[60px]">
                Escrow in One Line. No more trust issues. No more fear.
              </p>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section ref={highlightsRef} className="grid gap-3 relative">
          <div className="h-[300px] rounded-[24px] bg-[#121212] absolute inset-0 bg-gradient-to-b from-transparent via-[#e30101]/5 to-transparent blur-3xl" />
          <div className="flex gap-3 relative z-10">
            <div className="card w-full h-[300px] rounded-[24px] bg-[#121212] cursor-pointer" />
            <div className="card w-[60%] h-[300px] rounded-[24px] bg-[#121212] cursor-pointer" />
          </div>
        </section>

        {/* FAQs Section */}
        <section className='flex justify-between mt-75'>
          <div>
            <p className="text-[#e30101] text-sm font-semibold uppercase tracking-wider">FAQs</p>
            <p className="text-4xl md:text-5xl font-normal mt-4 leading-tight">
              Curious <br />About Avio?
            </p>
          </div>
          <Accordion type="single" collapsible className="w-150">
            <AccordionItem value="item-1">
              <AccordionTrigger>What's Avio?</AccordionTrigger>
              <AccordionContent>
                A payment gateway, that enables you to send, save money, and activate escrow agreement, using prompted rules.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What's Avio?</AccordionTrigger>
              <AccordionContent>
                A payment gateway, that enables you to send, save money, and activate escrow agreement, using prompted rules.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What's Avio?</AccordionTrigger>
              <AccordionContent>
                A payment gateway, that enables you to send, save money, and activate escrow agreement, using prompted rules.
              </AccordionContent>
            </AccordionItem>
          </Accordion>        
        </section>
      </div>
      
      <Footer />
    </div>
  )
}