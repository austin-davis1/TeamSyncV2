import { AdminView } from "../components/AdminView"
import { TechView } from "../components/TechnicianView"

export default function Home() {
  let view = sessionStorage.getItem("View")

  return <>{view == "Admin" ? <AdminView /> : <TechView />}</>
}
