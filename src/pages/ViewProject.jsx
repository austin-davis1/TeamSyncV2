import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Card from "../components/Card"
import { Link } from "react-router-dom"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState, useEffect } from "react";
import { ActionModal } from "../components/ActionModal";
import { BackButton } from "../components/BackButton";

import { setModal, setRefresh } from "../state/reduxActions";

export default function ViewProject() {
    let dispatch = useDispatch()

    const [wipTaskCount, setWipTaskCount] = useState(6)
    const [completedTaskCount, setCompletedTaskCount] = useState(4)
    let loading = useSelector(state => state.isLoading)

    let  { projectId } = useParams()
    let allProjects = useSelector(state => state.projects)
    let projectData = allProjects.find((project) => project._id === projectId )
    let allTasks = useSelector(state => state.bugs.filter((bug) => bug.projectId == projectId))

    console.log(projectData)

    return (
        <div className="h-auto">
        {!loading 
        ?
        <>
            <>
            <BackButton/>
            <div className="flex mt-8">
                <h1 className="flex w-full text-blue mb-10 rounded-lg text-7xl font-bold justify-left">{projectData.title}</h1>
            </div>
            <div className="w-full justify-items-center">
                <div className="w-full">
                    <h1 className="text-4xl">In Progress Tasks ({allTasks?.filter((task) => task.status === 1).length})</h1>
                </div>
                <div className="w-full justify-items-center grid grid-cols-2 gap-4">
                    {allTasks?.length == 0 ? <h1>None</h1> : allTasks?.filter((task) => task.status === 1)?.slice(0, wipTaskCount)?.map(bug => {
                        if (bug.status === 1){
                            return (<Card key={bug._id} issue={bug}/>)
                        }
                    }
                )}
                </div>
                <div className="flex flex-row items-center justify-center">
                    {wipTaskCount < allTasks?.filter((task) => task.status === 1).length &&
                        <span className="flex justify-center items-center bg-white mt-5 mb-5 mr-2 w-32 h-12 hover:border-4 rounded-lg hover:border-black hover:bg-blue hover:text-white cursor-pointer" onClick={() => setWipTaskCount(wipTaskCount + 6)}>View More</span>
                    }
                    {wipTaskCount > 6 &&
                        <span className="flex justify-center items-center bg-white mt-5 mb-5 ml-2 w-32 h-12 hover:border-4 rounded-lg hover:border-black hover:bg-blue hover:text-white cursor-pointer" onClick={() => setWipTaskCount(wipTaskCount - 6)}>View Less</span>
                    }
                </div>
                <div className="flex h-12 w-full mt-10 justify-center ">
                    <Link to="new_task" className = "flex h-full w-6/12 group border-dashed border-blue border-4 rounded-lg justify-center hover:bg-white hover:border-4 ">
                        <div className = "flex justify-center items-center text-blue w-12 group-hover:text-red">
                            <AddCircleOutlineIcon sx={{height: "100%", width: "100%"}}/>
                        </div>
                    </Link>
                </div>
                <div className="w-full text-4xl">
                    <h1 className="mt-16">Completed Tasks ({allTasks?.filter((task) => task.status === 0).length})</h1>
                </div>
                <div className="w-full justify-items-center grid grid-cols-2 gap-4 mb-12">
                    {allTasks?.length == 0 ? <h1>None</h1> : allTasks?.filter((task) => task.status === 0)?.slice(0, completedTaskCount).map(bug => {
                            return (<Card key={bug._id} issue={bug}/>) 
                        }
                    )}
                </div>
                <div className="flex flex-row items-center justify-center">
                    {completedTaskCount < allTasks?.filter((task) => task.status === 0).length &&
                        <span className="flex justify-center items-center bg-white mt-5 mb-5 mr-2 w-32 h-12 hover:border-4 rounded-lg hover:border-black hover:bg-blue hover:text-white cursor-pointer" onClick={() => setCompletedTaskCount(completedTaskCount + 4)}>View More</span>
                    }
                    {completedTaskCount > 4 &&
                        <span className="flex justify-center items-center bg-white mt-5 mb-5 ml-2 w-32 h-12 hover:border-4 rounded-lg hover:border-black hover:bg-blue hover:text-white cursor-pointer" onClick={() => setCompletedTaskCount(completedTaskCount - 4)}>View Less</span>
                    }
                </div>
            </div>
            </>
        </>
        :
            <h1>Loading...</h1>
        
        }
        </div>
    )
}