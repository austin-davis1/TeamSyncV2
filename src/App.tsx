import { useEffect } from "react"
import { HashRouter as Router, Route, Routes } from "react-router-dom"
import {
  setRefresh,
  setLoading,
  setData,
  setProjects,
} from "./state/reduxActions.ts"
import { useSelector, useDispatch } from "react-redux"

import { getAllTasks } from "./data/taskData.ts"
import { getAllProjects } from "./data/projectData.ts"

import { SiteLayout } from "./components/SiteLayout"

import Home from "./pages/Home.tsx"
import Landing from "./pages/Landing.tsx"
import ViewTask from "./pages/ViewTask"
import ViewProject from "./pages/ViewProject"
import NewIssue from "./pages/NewIssue.tsx"
import NewProject from "./pages/NewProject.tsx"
import ManageUsers from "./pages/ManageUsers.tsx"
import Projects from "./pages/Projects"
import UserProfile from "./pages/UserProfile"

import YourTasks from "./pages/YourTasks"
import UserTasks from "./pages/UserTasks"

function App() {
  let dispatch = useDispatch()

  let user = sessionStorage.getItem("User")
  const isLogged = useSelector((state) => state.isLoggedIn)

  useEffect(() => {
    async function loadData() {
      dispatch(setLoading(true))
      let allTasks = await getAllTasks()
      let projects = await getAllProjects()

      dispatch(setData(allTasks))
      dispatch(setRefresh(false))
      dispatch(setLoading(false))
      dispatch(setProjects(projects))
    }

    if (user) {
      loadData()
    }
  }, [useSelector((state) => state.needsRefresh)])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<SiteLayout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new_project" element={<NewProject />} />
          <Route
            path="/projects/view_project/:projectId"
            element={<ViewProject />}
          />
          <Route
            path="/projects/view_project/:projectId/new_task"
            element={<NewIssue />}
          />
          <Route
            path="/projects/view_project/:projectId/view_task/:taskId"
            element={<ViewTask />}
          />
          <Route path="/user_profile" element={<UserProfile />} />
          <Route path="/manage_users" element={<ManageUsers />} />
          <Route path="/your_tasks" element={<YourTasks />} />
          <Route path="/user_tasks/:userId" element={<UserTasks />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
