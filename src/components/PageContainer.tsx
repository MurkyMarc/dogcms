import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export const PageContainer = () => {
    return (
        <>
            <Header />
            <div className="min-h-[49.5rem]">
                <Outlet />
            </div>
            <Footer />
        </>
    )
}
