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
        <div className="footer text-secondary-foreground">
            <div className="footer-container">
                <div className="flex justify-between">
                    <div>
                        <img src="" alt=""/>
                        <p className="">Copyright @2025 Avio. All rights <br/>reserved</p>
                    </div>
                    <div>
                        <p className="">Nigeria</p>
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
        </div>
    )
}