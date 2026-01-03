import { ProjectCard } from "../components/ProjectCard"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { setRefresh, setModal, setProfilePictures, setUsers } from "../state/reduxActions"
import { updateProject, deleteProject } from "../data/projectData.js"
import { getAllUsers } from "../data/userData.js"
import { getAllFiles } from "../data/storageService"
import { useEffect, useState } from "react"
import { Loading } from "../components/LoadingIndicator"

export function Projects() {
    const [profilePictures, setProfilePicturesState] = useState(null)
    const [imagesLoaded, setImagesLoaded] = useState(false)
    const [users, setUsersState] = useState(null)
    const [usersLoaded, setUsersLoaded] = useState(false)

    const controller = new AbortController()
    const awsController = new AbortController();

    let dispatch = useDispatch()
    let projects = useSelector(state => state.projects)

    let isModal = useSelector(state => state.deleteModal)
    let deleteId = useSelector(state => state.selectedDelete)
    let modalType = useSelector(state => state.modalType)

    async function handleEvent(id) {
        let data = projects.find(project => project._id == id)

        if(modalType == "Delete"){
            await deleteProject(id);
        }
        else{
            data.status = 0;
            await updateProject(data);
        }

        dispatch(setRefresh(true))
        dispatch(setModal(false))
    }

    let allUsers = useSelector(state => state.users)
    let allPictures = useSelector(state => state.profilePictures)

    useEffect(() => {
        async function retrieveProfilePictures() {
            let allPictures = await getAllFiles(awsController)
            setProfilePicturesState(allPictures)
            dispatch(setProfilePictures(allPictures))
        }
        async function retrieveAllUsers() {
            let users = await getAllUsers(controller)
            setUsersState(users)
            dispatch(setUsers(users))
        }

        if (allUsers != null) {
            setUsersState(allUsers)
        } else {
            retrieveAllUsers()
        }
        
        if (allPictures != null) {
            setProfilePicturesState(allPictures)
        } else {
            retrieveProfilePictures()
        }

        return () =>  {
            controller.abort()
            awsController.abort()
        }

    }, [])

    useEffect(() => {
        if (users !== null) {
            setUsersLoaded(true)
        }
    }, [users])

    useEffect(() => {
        if (profilePictures !== null) {
            setImagesLoaded(true)
        }
    }, [profilePictures])

    return (
        <div className="h-auto">
        {isModal
        ?
        <>
            <div className="flex justify-center items-center w=24">
                <h1>Are you sure you want to {modalType} this bug?</h1>
            </div>
            <div className="grid grid-cols-2 justify-items-center items-center">
                <h1 onClick={() => handleEvent(deleteId)} className="cursor-pointer w-36 h-12 text-center font-bold bg-green rounded-lg">Yes</h1>
                <h1 onClick={() => dispatch(setModal(false))} className="cursor-pointer w-36 h-12 text-center font-bold bg-red rounded-lg">No</h1>
            </div>
        </>
        :
        <div className="flex flex-col w-full">
            <>
            {imagesLoaded && usersLoaded
            ?
                projects.map(project => <ProjectCard key={project._id} project={project} profilePictures={profilePictures} profileUsers={users}/>)
            :
                <><Loading/></>
            }
            <Link to="new_project" className = "flex justify-center bg-white border-solid border-2 border-black rounded-lg p-4 mt-6 mb-6 hover:bg-off-white cursor-pointer">
                <h1 className="text-4xl justify-center">New Project</h1>
            </Link>
            </>
        </div>
        }
    </div>
    )
}