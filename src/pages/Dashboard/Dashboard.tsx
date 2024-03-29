import { Outlet } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"

export default function Dashboard() {
    return (
        <div className="block border-t bg-background">
            <div className="md:grid md:grid-cols-6">
                <Sidebar className="hidden lg:block lg:col-span-1" />
                <div className="md:col-span-6 lg:col-span-5 border-l">
                    <div className="h-full px-4 py-4 lg:px-8">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}