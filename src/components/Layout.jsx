import { Outlet } from "react-router-dom";
import { SideBar } from "./SideBar";

export const Layout = () => {
    return (
        <div className="min-h-screen flex">
            <SideBar />

            <main className="w-full bg-black min-h-screen pb-[72px] md:pb-0 md:ml-20 lg:ml-44">
                <Outlet/>
            </main>

        </div>
    )

}
