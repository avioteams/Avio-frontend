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
  const navigate = useNavigate()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  const heroTextRef = useRef(null)
  const heroImageRef = useRef(null)
  const badgeRef = useRef(null)
  const targetRef = useRef(null)
  const featuresRef = useRef([])
  const highlightsRef = useRef(null)
  const gridRef = useRef(null)
  const cursorRef = useRef(null)
  const glowRef = useRef(null)

  const handleGetStarted = () => {
    navigate('/dashboard')
  }

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.to(gridRef.current, {
          backgroundPosition: "100% 100%",
          duration: 20,
          repeat: -1,
          ease: "none"
        })
      }

      const tl = gsap.timeline()
      tl.from(badgeRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })

      gsap.from(heroTextRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power4.out"
      })

      gsap.from(heroImageRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        delay: 0.5,
        ease: "back.out(1.4)"
      })

      gsap.to(heroImageRef.current, {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })

      gsap.from(targetRef.current, {
        scrollTrigger: {
          trigger: targetRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        scale: 0.95
      })

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
          duration: 1.2,
          ease: "power3.out"
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="landing relative overflow-hidden m-0 p-0 box-border bg-black text-white">
      {/* Custom Cursor - Hidden on mobile */}
      <div 
        ref={cursorRef}
        className="hidden md:block fixed w-4 h-4 bg-[#e30101] rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Ambient Glow */}
      <div 
        ref={glowRef}
        className="fixed w-96 h-96 bg-gradient-radial from-[#e30101]/20 to-transparent rounded-full blur-3xl pointer-events-none z-0"
        style={{ transform: 'translate(-50%, -50%)' }}
      />

      {/* Animated Grid */}
      <div 
        ref={gridRef}
        className="fixed inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(227, 1, 1, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(227, 1, 1, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <NavBar />
      
      <div className="grid gap-8 sm:gap-12 mt-20 sm:mt-24 md:mt-28 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 py-6 relative z-10">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center gap-8 sm:gap-12 text-center mt-6">
          <div className="grid gap-6">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <p 
                ref={badgeRef} 
                className="text-sm sm:text-base md:text-lg inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              >
                Powered by <span className="text-[#e30101] font-semibold">Avalanche</span>
                <span className="w-2 h-2 bg-[#e30101] rounded-full animate-pulse" />
              </p>
              
              <h1 
                ref={heroTextRef} 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[90px] font-semibold leading-tight"
              >
                Automate your <br />
                <span className="text-[#e30101]">Crypto</span> like Magic
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-1.5 justify-center mt-2">
              <Button 
                className="bg-[#e30101] text-white px-8 sm:px-12 py-4 sm:py-[18px] text-sm sm:text-base rounded-full font-bold hover:shadow-[0_0_30px_rgba(227,1,1,0.5)] transition-all relative overflow-hidden group w-full sm:w-auto"
                onClick={handleGetStarted}
              >
                <span className="relative z-10">Begin an Experience</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </Button>
              
              <Button 
                className="bg-secondary/10 text-white p-4 rounded-full border border-white/20 hover:border-[#e30101] hover:shadow-[0_0_20px_rgba(227,1,1,0.3)] transition-all w-full sm:w-auto"
                onClick={() => setShowWalletModal(true)}
              >
                <IconWallet size={24} />
              </Button>
            </div>
          </div>
          
          <div ref={heroImageRef} className="relative w-full max-w-[350px] sm:max-w-[450px] md:max-w-[550px]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e30101]/20 to-transparent blur-3xl" />
            <img 
              src="../Black folding wallet.png" 
              alt="Crypto Wallet" 
              className="relative z-10 w-full drop-shadow-2xl" 
            />
          </div>
        </section>

        {/* Target Audience */}
        <section ref={targetRef} className="py-3">
          <p className="text-[#e30101] text-sm sm:text-base md:text-lg font-bold uppercase tracking-wider">For you</p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal leading-tight mt-4">
            Whether it's a friend, a vendor, or a creator, sending money is now as{' '}
            <span className="text-[#e30101]">easy</span> as sending a message
          </p>
          <div className="bg-[#e30101] mt-12 sm:mt-16 md:mt-[90px] h-[40vh] sm:h-[50vh] md:h-[70vh] rounded-2xl sm:rounded-3xl md:rounded-[36px] overflow-hidden flex justify-center items-center">
            <img src="./Lady-on-red.jpg" className="w-full h-full object-cover" alt="" />
          </div>
        </section>

        {/* Features */}
        <section className="space-y-12 sm:space-y-16 md:space-y-20">
          {/* Feature 1 */}
          <div 
            ref={el => featuresRef.current[0] = el} 
            className="flex flex-col md:flex-row md:items-center gap-8 sm:gap-12 md:gap-16"
          >
            <img 
              src="./CreditCards.svg" 
              alt="Credit Cards" 
              className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[450px] mx-auto md:mx-0 drop-shadow-xl" 
            />
            <div className="flex-1">
              <p className="text-[#e30101] text-xs sm:text-sm font-semibold uppercase tracking-wider">For you</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-normal mt-4 leading-tight">
                It's a New Wave of Social Money
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div 
            ref={el => featuresRef.current[1] = el} 
            className="flex flex-col md:flex-row-reverse md:items-center gap-8 sm:gap-12 md:gap-16"
          >
            <img 
              src="./brown wallet turned left.png" 
              alt="Wallet" 
              className="w-full max-w-[250px] sm:max-w-[280px] md:max-w-[300px] mx-auto md:mx-0 drop-shadow-xl" 
            />
            <div className="flex-1">
              <p className="text-[#e30101] text-xs sm:text-sm font-semibold uppercase tracking-wider">Savings</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-normal mt-4 leading-tight">
                Smart Savings That Actually Save You
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div 
            ref={el => featuresRef.current[2] = el} 
            className="flex flex-col md:flex-row md:items-center gap-8 sm:gap-12 md:gap-16"
          >
            <img 
              src="./Escrow.svg" 
              alt="Escrow" 
              className="w-full max-w-[300px] sm:max-w-[350px] md:max-w-[450px] mx-auto md:mx-0 drop-shadow-xl" 
            />
            <div className="flex-1">
              <p className="text-[#e30101] text-xs sm:text-sm font-semibold uppercase tracking-wider">Creating Agreements</p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-normal mt-4 leading-tight">
                Escrow in One Line. No more trust issues. No more fear.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className='flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 mt-12 sm:mt-16 md:mt-20'>
          <div className="lg:w-1/3">
            <p className="text-[#e30101] text-xs sm:text-sm font-semibold uppercase tracking-wider">FAQs</p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-normal mt-4 leading-tight">
              Curious <br />About Avio?
            </p>
          </div>
          <Accordion type="single" collapsible className="flex-1 lg:w-2/3">
            <AccordionItem value="item-1" className="border-b border-[#e30101]/20 py-4">
              <AccordionTrigger className="text-left hover:text-[#e30101] transition-colors text-base sm:text-lg font-medium">
                What's Avio?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm sm:text-base leading-relaxed pt-2">
                A payment gateway that enables you to send, save money, and activate escrow agreements using prompted rules.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-b border-[#e30101]/20 py-4">
              <AccordionTrigger className="text-left hover:text-[#e30101] transition-colors text-base sm:text-lg font-medium">
                How does it work?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm sm:text-base leading-relaxed pt-2">
                Simply connect your wallet, set up automated rules using natural language, and let Avio handle your crypto transactions automatically.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border-b border-[#e30101]/20 py-4">
              <AccordionTrigger className="text-left hover:text-[#e30101] transition-colors text-base sm:text-lg font-medium">
                Is it secure?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-sm sm:text-base leading-relaxed pt-2">
                Yes! Avio is built on Avalanche blockchain with smart contracts that ensure your funds are always secure and transactions are transparent.
              </AccordionContent>
            </AccordionItem>
          </Accordion>        
        </section>
      </div>
      
      <Footer />
    </div>
  )
}