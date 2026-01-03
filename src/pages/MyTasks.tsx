import { useState } from "react"
import TaskCard from "../components/TaskCard"
import { Link } from "react-router-dom"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createTasksQueryOptions } from "../features/tasks/api/queries"
import { createProjectsQueryOptions } from "../features/projects/api/queries"

export default function MyTasks() {
  const [projectFilter, setProjectFilter] = useState(null)

  const user = sessionStorage.getItem("User")
  const userObj = JSON.parse(user)
  const username = userObj.username

  const { data: allTasks } = useSuspenseQuery(createTasksQueryOptions())
  const { data: allProjects } = useSuspenseQuery(createProjectsQueryOptions())

  const tasks = allTasks.filter((task) => task.users.includes(username))
  const projects = allProjects.filter((project) =>
    tasks.find((task) => task.projectId === project._id)
  )

  return (
    <>
      <div className="flex flex-row mt-2 mx-2">
        <h1 className="text-3xl">Filter: </h1>
        <button
          className="border-2 text-xl mx-4 p-2 rounded-lg"
          onClick={() => setProjectFilter(null)}
        >
          None
        </button>
        {projects.map((project) => {
          return (
            <button
              className={
                "border-2 text-xl mx-4 p-2 rounded-lg " +
                (projectFilter == project._id ? "bg-blue" : "")
              }
              onClick={() => setProjectFilter(project._id)}
            >
              {project.title.slice(0, 15)}...
            </button>
          )
        })}
      </div>
      <div className="flex flex-col h-full">
        {projects
          .filter((project) => {
            if (projectFilter == null) {
              return project
            } else {
              return project._id == projectFilter
            }
          })
          .map((project) => {
            return (
              <>
                <Link to={`/projects/view_project/${project._id}`}>
                  <div className="flex bg-white justify-between border-solid border-2 border-black rounded-lg p-2 mt-6 mb-6 h-auto hover:bg-off-white cursor-pointer">
                    <span className="flex flex-col h-full w-full bg-white">
                      <div className="flex w-full bg-blue rounded-lg h-auto">
                        <h1 className="text-4xl p-2 text-white font-bold">
                          {project.title}
                        </h1>
                      </div>
                      <div className="flex flex-row items-center">
                        <div className="flex flex-col w-4/12 bg-white p-2 mt-2 mb-6 mr-16 cursor-pointer">
                          <h1 className="text-2xl font-bold">
                            Project Description:
                          </h1>
                          <div className="flex w-full text-black">
                            <h1 className="text-lg text-black italic">
                              {project.description}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                </Link>
                <div className="flex flex-col ml-24">
                  {tasks.map((task) => {
                    return <TaskCard key={task._id} task={task} />
                  })}
                </div>
              </>
            )
          })}
      </div>
    </>
  )
}
