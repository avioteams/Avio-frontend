import { NavLink } from "react-router-dom";
import "../components/style/side-bar.css"

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <nav>
                <div className="logo-side">
                    <img src="../Logo.svg" alt="" />
                </div>
                <ul className="side">
                    <li className="side-li">
                        <NavLink className={({
                            isActive
                        }) => (isActive ? 'active' : '')} 
                        style={({isActive}) => (isActive ? {backgroundColor: '#e30101', color: '#fff', padding: '14px 36px'} : {})}
                        aria-current="page"
                        end
                        to="/dashboard/home">Overview</NavLink>
                    </li>
                    <li className="side-li">
                        <NavLink className={({
                            isActive
                        }) => (isActive ? 'active' : '')} 
                        style={({isActive}) => (isActive ? {backgroundColor: '#e30101', color: '#fff', padding: '16px 36px'} : {})}
                        aria-current="page"
                        end to="/dashboard/deposit">Fund Wallet</NavLink>
                    </li>
                    <li className="side-li">
                        <NavLink className={({
                            isActive
                        }) => (isActive ? 'active' : '')} 
                        style={({isActive}) => (isActive ? {backgroundColor: '#e30101', color: '#fff'} : {})}
                        aria-current="page"
                        end to="/dashboard/history">Transaction History</NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}