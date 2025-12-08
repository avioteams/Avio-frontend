import { Button } from '@/components/ui/button'
import { NavLink } from "react-router-dom";

export default function Footer() {
    const QuickLinks = [{
        link: "Home",
        to: "/home"
    }, {
        link: "Why Avio",
        to: "/aboutus"
    }, {
        link: "Features",
        to: "/features"
    }, {
        link: "Customer Support",
        to: "/customer"
    }
]
    const Socials = [{
        link: "Twitter",
        to: "/twitter"
    }, {
        link: "LinkedIn",
        to: "/linkedin"
    }, {
        link: "Discord",
        to: "/discord"
    }, {
        link: "Instagram",
        to: "/instagram"
    }
]
    return (
        <div className="bg-secondary mt-32 text-secondary-foreground">
            <div className="grid gap-8 px-12 pt-12 pb-0">
                <div className="flex justify-between place-items-center">
                    <div className="flex gap-6 place-items-center">
                        {/* <img src="./logo-variant.svg" className="w-30" alt="./logo-variant.svg"/> */}
                        <p className="text-sm">Copyright @2025 Avio. All rights reserved</p>
                    </div>
                    <div className="flex gap-2 place-items-center">
                        <p className="text-lg italic font-bold">Nigeria</p>
                        <img src="./Nigerian Flag.svg" className="w-6" alt="Nigerian Flag"/>
                    </div>
                </div>
                <div className="flex justify-between px-8 mt-12 mr-24">
                    <div className="grid gap-8">
                        <p className="w-130 leading-relaxed text-xl">Whether it's a friend, a vendor, or a creator, sending money is now as easy as sending a message</p>
                        <Button className="rounded-full w-fit">Connect Wallet</Button>
                    </div>
                    <div className="flex gap-12 leading-9">
                        <ul>
                            {QuickLinks.map(quicklink =>
                                <li>
                                    <NavLink className="text-gray-300"
                                    aria-current="page"
                                    end
                                    to={quicklink.to}>{quicklink.link}</NavLink>
                                </li>
                            )}
                        </ul>
                        <ul>
                            {Socials.map(social =>
                                <li>
                                    <NavLink className="text-gray-300"
                                    aria-current="page"
                                    end
                                    to={social.to}>{social.link}</NavLink>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                <img src="./Avio footer bd.svg" className="w-full" alt="" />
            </div>
        </div>
    )
}