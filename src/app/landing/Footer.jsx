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
    return (
        <div className="bg-secondary mt-12 text-secondary-foreground">
            <div className="grid gap-8 px-12 pt-8 pb-0">
                <div className="flex justify-between">
                    <div>
                        <img src="./logo-variant.svg" className="w-35" alt="./logo-variant.svg"/>
                        <p className="">Copyright @2025 Avio. All rights <br/>reserved</p>
                    </div>
                    <div className="flex gap-2 justify-between">
                        <p className="text-16">Nigeria</p>
                        <img src="./Nigerian Flag.svg" className="w-8" alt="Nigerian Flag"/>
                    </div>
                </div>
                <div className="flex">
                    <div>
                        <p>Whether it's a friend, a vendor, or a creator, sending money is now as easy as sending a message</p>
                        <Button className="rounded-full">Connect Wallet</Button>
                    </div>
                    <div>
                        <ul>
                            {QuickLinks.map(quicklink =>
                                <li>
                                    <NavLink className="text-secondary-foreground"
                                    aria-current="page"
                                    end
                                    to={quicklink.to}>{quicklink.link}</NavLink>
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