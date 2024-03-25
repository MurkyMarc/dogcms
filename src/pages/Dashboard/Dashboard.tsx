import { Sidebar } from "./components/sidebar"
import { Outlet } from "react-router-dom"

export default function Dashboard() {
    return (
        <div className="block">
            <div className="border-t">
                <div className="bg-background">
                    <div className="md:grid md:grid-cols-6">
                        <Sidebar className="hidden lg:block lg:col-span-1" />
                        <div className="md:col-span-6 lg:col-span-5 border-l">
                            <div className="h-full px-4 py-4 lg:px-8">
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}