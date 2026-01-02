import { Link } from "react-router-dom"
import { setRefresh, setModal, setDelete, setModalType } from "../state/reduxActions"
import { useDispatch } from "react-redux"
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { TagButton } from "./TagButton";
import { ActionModal } from "./ActionModal";
import { useState, useEffect } from "react";

export default function Card({issue}) {
    let url
    let dispatch = useDispatch()

    const [modalAction, setModalAction] = useState(null)
    const [modalType, setModalType] = useState({})
    const [selectedData, setSelectedData] = useState([])
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (modalAction !== null) {
            console.log(modalAction)
            let data = issue
            let type = {}
    
            if (modalAction == "Delete") {
                type.title = "Delete Task"
                type.message = "Are you sure you want to delete this task? If you delete it, it will be deleted from your history forever."
                type.action = "DeleteTask"
            } else if (modalAction == "Archive") {
                type.title = "Mark as completed"
                type.message = "Are you sure you want to mark this task as complete? You can always revert later if you change your mind."
                type.action = "ArchiveTask"
            } else if (modalAction == "Revert") {
                type.title = "Revert Task"
                type.message = "Are you sure you want to change this task from complete to in-progress? You can always mark it as complete again if you change your mind."
                type.action = "RevertTask"
            }
    
            setModalType(type)
            setShowModal(true)
            setSelectedData(data)
        }
    }, [modalAction])

    let tags = issue.tags

    if (issue) {
        JSON.parse(JSON.stringify(issue))
        url = `/projects/view_project/${issue.projectId}/view_task/${issue._id}`
    }

    return (
    <>
        {showModal && <ActionModal type={modalType} data={selectedData} showModal={showModal} setShowModal={setShowModal}/>}
        <div className = "transition-all flex flex-col duration-200 w-full h-full p-5 mt-2 mb-2 mr-5 border-solid border-2 border-black rounded-lg cursor-pointer group bg-white hover:bg-hover-gray hover:border-blue">
            <Link className = "h-full" to={url}>
                <div className="w-full pl-2 bg-blue rounded-lg">
                    <h1 className = "text-3xl text-white truncate font-bold">{issue.title}</h1>
                </div>
                <div className="mt-4">
                    <span className="font-bold text-2xl">Task Description:</span>
                    <h2 className = "text-lg">{issue.description}</h2>
                </div>
            </Link>
            <div className="flex justify-between">
                {tags &&
                <div>
                    {tags.map(tag => {return <TagButton key={tag} tag={tag}/>})}
                </div>
                }
                <>
                {issue.status == 1
                ?
                <div className="flex justify-end">
                    <div className="flex hover:bg-white h-12 w-12 text-green rounded-full justify-center items-center" onClick={() => setModalAction("Archive")}>
                        <CheckCircleOutlineIcon sx={{height: "100%", width: "100%"}}/>
                    </div>
                    <div className="flex hover:bg-white h-12 w-12 text-red justify-center rounded-full items-center" onClick={() => setModalAction("Delete")}>
                        <HighlightOffIcon sx={{height: "100%", width: "100%"}}/>
                    </div>
                </div>
                :
                <div className="flex justify-end">
                    <div className="flex hover:bg-white h-12 w-12 text-blue rounded-full justify-center items-center" onClick={() => setModalAction("Revert")}>
                        <SettingsBackupRestoreIcon sx={{height: "100%", width: "100%"}}/>
                    </div>
                </div>
                }
                </>
            </div>
        </div>
    </>
    )
}
