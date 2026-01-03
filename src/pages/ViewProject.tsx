import { useParams } from "react-router-dom"
import TaskCard from "../components/TaskCard"
import { Link } from "react-router-dom"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { useState } from "react"
import { BackButton } from "../components/BackButton"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createTasksQueryOptions } from "../features/tasks/api/queries"
import { createProjectsQueryOptions } from "../features/projects/api/queries"
import { ActionModal } from "../components/TaskActionModal"

export type TaskModalType = "Archive" | "Delete" | "Revert"

export default function ViewProject() {
  const { data: allTasks, isPending: loadingTasks } = useSuspenseQuery(
    createTasksQueryOptions()
  )
  const { data: allProjects, isPending: loadingProjects } = useSuspenseQuery(
    createProjectsQueryOptions()
  )
  const loading = loadingTasks || loadingProjects

  const [modalType, setModalType] = useState<TaskModalType>()
  const [selectedTask, setSelectedTask] = useState()

  const [wipTaskCount, setWipTaskCount] = useState(6)
  const [completedTaskCount, setCompletedTaskCount] = useState(4)

  const { projectId } = useParams()
  const projectData = allProjects.find((project) => project._id === projectId)
  const projectTasks = allTasks.filter((bug) => bug.projectId == projectId)

  return (
    <div className="h-auto">
      {modalType && (
        <ActionModal
          type={modalType}
          setModalType={setModalType}
          task={selectedTask}
        />
      )}
      {!loading ? (
        <>
          <>
            <BackButton />
            <div className="flex mt-8">
              <h1 className="flex w-full text-blue mb-10 rounded-lg text-7xl font-bold justify-left">
                {projectData.title}
              </h1>
            </div>
            <div className="w-full justify-items-center">
              <div className="w-full">
                <h1 className="text-4xl">
                  In Progress Tasks (
                  {projectTasks?.filter((task) => task.status === 1).length})
                </h1>
              </div>
              <div className="w-full justify-items-center grid grid-cols-2 gap-4">
                {projectTasks?.length == 0 ? (
                  <h1>None</h1>
                ) : (
                  projectTasks
                    ?.filter((task) => task.status === 1)
                    ?.slice(0, wipTaskCount)
                    ?.map((bug) => {
                      return (
                        <TaskCard
                          key={bug._id}
                          task={bug}
                          setSelectedTask={setSelectedTask}
                          setModalType={setModalType}
                        />
                      )
                    })
                )}
              </div>
              <div className="flex flex-row items-center justify-center">
                {wipTaskCount <
                  projectTasks?.filter((task) => task.status === 1).length && (
                  <span
                    className="flex justify-center items-center bg-white mt-5 mb-5 mr-2 w-32 h-12 hover:border-4 rounded-lg hover:border-black hover:bg-blue hover:text-white cursor-pointer"
                    onClick={() => setWipTaskCount(wipTaskCount + 6)}
                  >
                    View More
                  </span>
                )}
                {wipTaskCount > 6 && (
                  <span
                    className="flex justify-center items-center bg-white mt-5 mb-5 ml-2 w-32 h-12 hover:border-4 rounded-lg hover:border-black hover:bg-blue hover:text-white cursor-pointer"
                    onClick={() => setWipTaskCount(wipTaskCount - 6)}
                  >
                    View Less
                  </span>
                )}
              </div>
              <div className="flex h-12 w-full mt-10 justify-center ">
                <Link
                  to="new_task"
                  className="flex h-full w-6/12 group border-dashed border-blue border-4 rounded-lg justify-center hover:bg-white hover:border-4 "
                >
                  <div className="flex justify-center items-center text-blue w-12 group-hover:text-red">
                    <AddCircleOutlineIcon
                      sx={{ height: "100%", width: "100%" }}
                    />
                  </div>
                </Link>
              </div>
              <div className="w-full text-4xl">
                <h1 className="mt-16">
                  Completed Tasks (
                  {projectTasks?.filter((task) => task.status === 0).length})
                </h1>
              </div>
              <div className="w-full justify-items-center grid grid-cols-2 gap-4 mb-12">
                {projectTasks?.length == 0 ? (
                  <h1>None</h1>
                ) : (
                  projectTasks
                    ?.filter((task) => task.status === 0)
                    ?.slice(0, completedTaskCount)
                    .map((bug) => {
                      return (
                        <TaskCard
                          key={bug._id}
                          task={bug}
                          setSelectedTask={setSelectedTask}
                          setModalType={setModalType}
                        />
                      )
                    })
                )}
              </div>
              <div className="flex flex-row items-center justify-center">
                {completedTaskCount <
                  projectTasks?.filter((task) => task.status === 0).length && (
                  <span
                    className="flex justify-center items-center bg-white mt-5 mb-5 mr-2 w-32 h-12 hover:border-4 rounded-lg hover:border-black hover:bg-blue hover:text-white cursor-pointer"
                    onClick={() =>
                      setCompletedTaskCount(completedTaskCount + 4)
                    }
                  >
                    View More
                  </span>
                )}
                {completedTaskCount > 4 && (
                  <span
                    className="flex justify-center items-center bg-white mt-5 mb-5 ml-2 w-32 h-12 hover:border-4 rounded-lg hover:border-black hover:bg-blue hover:text-white cursor-pointer"
                    onClick={() =>
                      setCompletedTaskCount(completedTaskCount - 4)
                    }
                  >
                    View Less
                  </span>
                )}
              </div>
            </div>
          </>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  )
}
