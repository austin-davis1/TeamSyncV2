
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export function SiteLayout() {

    let user = sessionStorage.getItem("User")
    let navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate("/")
        }
    }, [user])

    return (
        <>
            <Navbar/>
            <main>
                <div className="p-5 font-sans h-full bg-off-white pt-0 pb-0 flex m-8 rounded-lg flex-col lg:ml-80">
                    <Outlet/>
                </div>
            </main>
        </>
    )
}