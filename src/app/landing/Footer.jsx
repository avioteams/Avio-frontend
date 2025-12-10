import { Button } from '@/components/ui/button'
import { NavLink } from "react-router-dom"

export default function Footer() {
  const QuickLinks = [
    { link: "Home", to: "/home" },
    { link: "Why Avio", to: "/aboutus" },
    { link: "Features", to: "/features" },
    { link: "Customer Support", to: "/customer" }
  ]
  
  const Socials = [
    { link: "Twitter", to: "/twitter" },
    { link: "LinkedIn", to: "/linkedin" },
    { link: "Discord", to: "/discord" },
    { link: "Instagram", to: "/instagram" }
  ]

  return (
    <div className="bg-secondary mt-20 sm:mt-32 text-secondary-foreground">
      <div className="grid gap-6 sm:gap-8 px-4 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-0">
        
        {/* Top Section - Copyright & Location */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0 sm:items-center">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 sm:items-center">
            <p className="text-xs sm:text-sm max-w-[200px] sm:max-w-none">
              Copyright @2025 Avio. All rights reserved
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-base sm:text-lg italic font-bold">Nigeria</p>
            <img src="./Nigerian Flag.svg" className="w-5 sm:w-6" alt="Nigerian Flag"/>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-0 lg:justify-between lg:px-8 mt-6 sm:mt-12">
          
          {/* Left Section - CTA */}
          <div className="grid gap-6 sm:gap-8 max-w-xl">
            <p className="leading-relaxed text-lg sm:text-xl lg:text-2xl">
              Whether it's a friend, a vendor, or a creator, sending money is now as easy as sending a message
            </p>
            <Button className="rounded-full w-fit px-6 sm:px-8 py-5 bg-[#e30101] hover:bg-[#c10101] text-white hover:shadow-[0_0_20px_rgba(227,1,1,0.4)] transition-all">
              Connect Wallet
            </Button>
          </div>
          
          {/* Right Section - Links */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-16 leading-8 sm:leading-9">
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                {QuickLinks.map((quicklink, i) =>
                  <li key={i}>
                    <NavLink 
                      className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                      aria-current="page"
                      end
                      to={quicklink.to}
                    >
                      {quicklink.link}
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Social</h4>
              <ul className="space-y-2">
                {Socials.map((social, i) =>
                  <li key={i}>
                    <NavLink 
                      className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                      aria-current="page"
                      end
                      to={social.to}
                    >
                      {social.link}
                    </NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Image */}
      <div className="mt-8">
        <img src="./Avio footer bd.svg" className="w-full" alt="" />
      </div>
    </div>
  )
}