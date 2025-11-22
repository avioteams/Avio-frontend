import { Outlet } from "react-router-dom";
import '../index.css'
import Sidebar from "../components/sideBar";


export default function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="content">
                <Outlet />
            </main>
        </div>
    )
}