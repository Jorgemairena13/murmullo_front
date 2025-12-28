import { Outlet } from "react-router-dom";
import { SideBar } from "./SideBar";

export const Layout = () => {
    return (
        <div className="min-h-screen">
            <SideBar />

            <main className="w-full bg-red-600 min-h-screen">
                <Outlet/>
            </main>

        </div>
    )

}
