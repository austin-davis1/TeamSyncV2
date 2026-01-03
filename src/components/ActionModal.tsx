import { useState, useEffect } from "react"
import { updateTask, deleteTask } from "../data/taskData.js"
import { updateProject, completeProject } from "../data/projectData.js"
import { useDispatch } from "react-redux"
import { setRefresh } from "../state/reduxActions"

export function ActionModal({type, data, showModal, setShowModal}) {
    //const [showModal, setShowModal] = useState(true)
    const [commitAction, setCommitAction] = useState(false)

    let dispatch = useDispatch()

    let user = sessionStorage.getItem("User")
    let userObj = JSON.parse(user)

    let title = type.title
    let message = type.message
    let action = type.action

    console.log("Modal Action")
    console.log(action)

    console.log("Modal Task")
    console.log(data)

    function checkAction(actionTaken) {
        if (actionTaken == "Confirm") {
            setCommitAction(true)
        } 
        setShowModal(false)
    }

    useEffect(() => {
        if (commitAction) {
            console.log(action)
            if (action == "DeleteTask") {
                deleteTask(data._id)
            } else if (action == "ArchiveTask") {
                data.completedBy = userObj.username;
                data.status = 0;
                updateTask(data);
                //editTask(data._id, data, 0)
            } else if (action == "DeleteProject") {
                deleteProject(data._id)
            } else if (action == "ArchiveProject") {
                completeProject(data)
            } else if (action == "RevertTask") {
                data.status = 1;
                updateTask(data);
                //editTask(data._id, data, 1)
            } else if (action == "RevertProject") {
              data.status = 1;
              updateProject(data);  
              //editProject(data._id, data, 1)
            }
            dispatch(setRefresh(true))
            setShowModal(false)
        }
    }, [commitAction])

    return (
        <>
        {showModal ?
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    {title}
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">

                    </span>
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
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setCommitAction(true)}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
        :
        <></>
        }
        </>
    )
}