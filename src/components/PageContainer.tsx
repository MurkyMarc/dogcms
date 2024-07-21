import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export const PageContainer = () => {
    return (
        <>
            <Header />
            <div className="">
                <Outlet />
            </div>
            <Footer />
        </>
    )
}
