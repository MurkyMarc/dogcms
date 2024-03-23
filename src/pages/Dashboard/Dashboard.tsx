import { Sidebar } from "./components/sidebar"
import { Tabs, TabsContent } from "../../components/ui/tabs"
import DashboardMyDogs from "./components/DashboardMyDogs"
import DashboardMyWalks from "./components/DashboardWalks"
import DashboardSchedules from "./components/DashboardSchedules"
import { SetStateAction, useState } from "react"

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("mydogs");
    const setTab = (tab: SetStateAction<string>) => setActiveTab(tab);

    return (
        <div className="block">
            <div className="border-t">
                <div className="bg-background">
                    <div className="md:grid md:grid-cols-6">
                        <Sidebar setTab={setTab} className="hidden lg:block lg:col-span-1" />
                        <div className="md:col-span-6 lg:col-span-5 border-l">
                            <div className="h-full px-4 py-4 lg:px-8">
                                <Tabs value={activeTab} className="h-full space-y-6">
                                    <TabsContent
                                        value="mydogs"
                                        className="border-none p-0 outline-none"
                                    >
                                        <DashboardMyDogs setTab={setTab} />
                                    </TabsContent>
                                    <TabsContent
                                        value="walks"
                                        className="border-none p-0 outline-none"
                                    >
                                        <DashboardMyWalks setTab={setTab} />
                                    </TabsContent>
                                    <TabsContent
                                        value="schedules"
                                        className="border-none p-0 outline-none"
                                    >
                                        <DashboardSchedules setTab={setTab} />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}