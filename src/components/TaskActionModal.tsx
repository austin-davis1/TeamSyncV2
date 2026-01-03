import { type Dispatch, type SetStateAction } from "react"
import { updateTask, deleteTask } from "../data/taskData.js"
import type { TaskModalType } from "../pages/ViewProject.js"
import { useQueryClient } from "@tanstack/react-query"
import type { Task } from "../features/tasks/api/schemas.js"

export function TaskActionModal({
  type,
  setModalType,
  task,
}: {
  type: TaskModalType
  setModalType: Dispatch<SetStateAction<TaskModalType | undefined>>
  task: Task
}) {
  const queryClient = useQueryClient()

  const user = sessionStorage?.getItem("User") ?? ""
  const userObj = JSON.parse(user)

  const title = titleOptions[type]
  const message = messageOptions[type]

  const handleArchive = async () => {
    await updateTask({ ...task, completedBy: userObj.username, status: 0 })
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
    setModalType(undefined)
  }

  const handleDelete = async () => {
    await deleteTask(task._id)
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
    setModalType(undefined)
  }

  const handleRevert = async () => {
    await updateTask({ ...task, status: 1 })
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
    setModalType(undefined)
  }

  const handleEvent =
    type === "Archive"
      ? handleArchive
      : type === "Delete"
      ? handleDelete
      : handleRevert

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">{title}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setModalType(undefined)}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"></span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p className="my-4 text-slate-500 text-lg leading-relaxed">
                {message}
              </p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setModalType(undefined)}
              >
                Cancel
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleEvent}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}

const titleOptions: Record<TaskModalType, string> = {
  Archive: "Mark as completed",
  Delete: "Delete Task",
  Revert: "Revert Task",
}

const messageOptions: Record<TaskModalType, string> = {
  Archive:
    "Are you sure you want to mark this task as complete? You can always revert later if you change your mind.",
  Delete:
    "Are you sure you want to delete this task? If you delete it, it will be deleted from your history forever.",
  Revert:
    "Are you sure you want to change this task from complete to in-progress? You can always mark it as complete again if you change your mind.",
}
