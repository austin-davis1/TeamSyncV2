import { useSelector } from "react-redux"
import { AdminView } from "../components/AdminView"
import { TechView } from "../components/TechnicianView"
import { useState, useEffect } from "react"

export default function Home() {
  const [auth, setAuth] = useState("")

  let dashView = useSelector((state) => state.dashboardView)
  let view = sessionStorage.getItem("View")

  useEffect(() => {
    /*let userAuth = select(state => state.dashboardView)
        setAuth(userAuth)*/
    if (dashView == "Admin") {
      setAuth("Admin")
    } else {
      setAuth("User")
    }
    console.log("REDUX STATE HAS CHANGED IN HOME :D")
  }, [useSelector((state) => state.dashboardView)])

  return <>{view == "Admin" ? <AdminView /> : <TechView />}</>
}
