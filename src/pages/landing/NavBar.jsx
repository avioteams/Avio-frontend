import { NavLink } from "react-router-dom";
import "./style/navbar.css"
import Button from "../../components/button";

export default function NavBar() {
    const QuickLinks = [{
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
        <nav className="landing-navbar-container">
            <div className="navbar">
                <section className="logo">
                    <img src="../Logo.svg" alt="" />
                </section>
                <section className="links">
                    <ul className="landing-ul">
                        {QuickLinks.map(quicklink =>
                            <li>
                                <NavLink className={({
                                    isActive
                                }) => (isActive ? 'active' : '')} 
                                style={({isActive}) => (isActive ? {backgroundColor: '#e30101', color: '#fff', padding: '14px 36px'} : {})}
                                aria-current="page"
                                end
                                to={quicklink.to}>{quicklink.link}</NavLink>
                            </li>
                        )}
                    </ul>
                </section>
                <section className="quick-actions">
                    <Button className="outline">Login</Button>
                    <Button className="primary">Get Started</Button>
                </section>
            </div>
        </nav>
    )
}