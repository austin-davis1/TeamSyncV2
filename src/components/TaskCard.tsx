import { Link } from "react-router-dom"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore"
import { TagButton } from "./TagButton"

export default function TaskCard({ task, setModalType, setSelectedTask }) {
  return (
    <>
      <div className="transition-all flex flex-col duration-200 w-full h-full p-5 mt-2 mb-2 mr-5 border-solid border-2 border-black rounded-lg cursor-pointer group bg-white hover:bg-hover-gray hover:border-blue">
        <Link
          className="h-full"
          to={`/projects/view_project/${task.projectId}/view_task/${task._id}`}
        >
          <div className="w-full pl-2 bg-blue rounded-lg">
            <h1 className="text-3xl text-white truncate font-bold">
              {task.title}
            </h1>
          </div>
          <div className="mt-4">
            <span className="font-bold text-2xl">Task Description:</span>
            <h2 className="text-lg">{task.description}</h2>
          </div>
        </Link>
        <div className="flex justify-between">
          {task?.tags && (
            <div>
              {task.tags.map((tag) => {
                return <TagButton key={tag} tag={tag} />
              })}
            </div>
          )}
          <>
            {task.status == 1 ? (
              <div className="flex justify-end">
                <div
                  className="flex hover:bg-white h-12 w-12 text-green rounded-full justify-center items-center"
                  onClick={() => {
                    setSelectedTask(task)
                    setModalType("Archive")
                  }}
                >
                  <CheckCircleOutlineIcon
                    sx={{ height: "100%", width: "100%" }}
                  />
                </div>
                <div
                  className="flex hover:bg-white h-12 w-12 text-red justify-center rounded-full items-center"
                  onClick={() => {
                    setSelectedTask(task)
                    setModalType("Delete")
                  }}
                >
                  <HighlightOffIcon sx={{ height: "100%", width: "100%" }} />
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div
                  className="flex hover:bg-white h-12 w-12 text-blue rounded-full justify-center items-center"
                  onClick={() => {
                    setSelectedTask(task)
                    setModalType("Revert")
                  }}
                >
                  <SettingsBackupRestoreIcon
                    sx={{ height: "100%", width: "100%" }}
                  />
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </>
  )
}
