import { CardSection } from "./CardSection"
import { useSelector } from "react-redux"
import { allTags } from "./allTags"
import { useState, useEffect } from "react"
import { UserSection } from "./UserSection"
import { BarGraph } from "./BarGraph"
import { PieChart } from "./PieChart"
import { Loading } from "./LoadingIndicator"
import { CollectionsBookmarkOutlined } from "@mui/icons-material"
import { PercentBar } from "./PercentBar"

export function AdminView() {
    let allTasks = useSelector(state => state.bugs)
    let allProjects = useSelector(state => state.projects)
    let loading = useSelector(state => state.isLoading)

    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [activeTasks, setActiveTasks] = useState([])
    const [percentageObject, setPercentageObject] = useState({})
    const [pieOptions, setPieOptions] = useState({labels: [], data: []});
    const [pieLoaded, setPieLoaded] = useState(false)
    const [barLabels, setBarLabels] = useState([])
    const [barData, setBarData] = useState([])
    const [barLoaded, setBarLoaded] = useState(false)
    const [bar2Labels, setBar2Labels] = useState([])
    const [bar2Data, setBar2Data] = useState([])
    const [bar2Loaded, setBar2Loaded] = useState(false)
    const [tasksLoaded, setTasksLoaded] = useState(false)
    
    const projectColors = ["#ff4560", "#feb019", "#00e396", "#008ffb", "#0068b9", "#775dd0"]
    const debuggoBlue = ["#004aad"]

    useEffect(() => {
        setTasks(allTasks)
        setActiveTasks(allTasks.filter((task) => task.status == 1))
        setProjects(allProjects)
    }, [useSelector(state => state.isLoading)])

    useEffect(() => {
        function calculatePercentages(tags) {
            let percentageObj = {}
            for (let tag of tags) {
                let tagCount = allTasks.filter((task) => task.tags.find((tagItem) => tagItem == tag)).length
                percentageObj[tag] = tagCount / allTasks.length
            }
            setPercentageObject(percentageObj)
        }

        function calculateTasksPerProject(tasks, projects) {
            let freqMap = {}
            for (let task of tasks) {
                if (task.projectId in freqMap) {
                    freqMap[task.projectId] += 1
                } else {
                    freqMap[task.projectId] = 1
                }
            }
    
            let labels = []
            for (let project of projects) {
                if (project._id in freqMap) {
                    labels.push(project.title)
                }
            }
    
            const pieData = Object.values(freqMap);
            if (Object.keys(freqMap).length > 0 && labels.length > 0) {
                setPieOptions({
                    ...pieOptions,
                    labels:labels,
                    data:pieData
                })
            }
        }

        const MILLISECONDS_IN_WEEK = 604800000
        let currentDate = new Date() 
        let currentTime = currentDate.getTime()
        let currentWeek
        let currentWeekTasks
        let currentWeekCount

        function calculateTasksByDate(tasks) {
            currentDate = new Date() 
            currentTime = currentDate.getTime()

            currentWeek = currentTime - MILLISECONDS_IN_WEEK
            let lastWeek = currentTime - (MILLISECONDS_IN_WEEK * 2)
            let twoWeek = currentTime - (MILLISECONDS_IN_WEEK * 3)
            let threeWeek = currentTime - (MILLISECONDS_IN_WEEK * 4)

            let currentWeekDate = new Date(currentWeek)
            let lastWeekDate = new Date(lastWeek)
            let twoWeekDate = new Date(twoWeek)
            let threeWeekDate = new Date(threeWeek)


            currentWeekTasks = tasks.filter((task) => {
                if (task.dateCompleted !== null) {
                    let completeDate =  new Date(task.dateCompleted)
                    return (completeDate.getTime() > currentWeek)
                }
            })

            currentWeekCount = currentWeekTasks.length

            let lastWeekCount = tasks.filter((task) => {
                if (task.dateCompleted !== null) {
                    let completeDate =  new Date(task.dateCompleted)
                    return (completeDate.getTime() > lastWeek && completeDate.getTime() < currentWeek)
                }
            }).length

            let twoWeekCount = tasks.filter((task) => {
                if (task.dateCompleted !== null) {
                    let completeDate =  new Date(task.dateCompleted)
                    return (completeDate.getTime() > twoWeek && completeDate.getTime() < lastWeek)
                }
            }).length

            let threeWeekCount = tasks.filter((task) => {
                if (task.dateCompleted !== null) {
                    let completeDate =  new Date(task.dateCompleted)
                    return (completeDate.getTime() > threeWeek && completeDate.getTime() < twoWeek)
                }
            }).length

            setBarLabels([
                threeWeekDate.toString().slice(4, 10),
                twoWeekDate.toString().slice(4, 10),
                lastWeekDate.toString().slice(4, 10),
                currentWeekDate.toString().slice(4, 10)
            ])

            setBarData([
                threeWeekCount,
                twoWeekCount,
                lastWeekCount,
                currentWeekCount
            ])
        }
    
        function calculateTasksCompletedByProject(projects) {
            let freqMap = {}
            
            for (let project of projects) {
                let currentProjectCount = currentWeekTasks.filter((task) => task.projectId == project._id).length
                freqMap[project.title.slice(0,10)] = currentProjectCount
            }

            console.log("BAR 2 KEYS")
            console.log(Object.keys(freqMap))

            console.log("BAR 2 VALUES")
            console.log(Object.values(freqMap))

            setBar2Labels(Object.keys(freqMap))
            setBar2Data(Object.values(freqMap))
        }

        if (tasks.length > 0) {
            calculateTasksPerProject(tasks, projects)
            calculatePercentages(allTags)
            calculateTasksByDate(tasks)
            calculateTasksCompletedByProject(projects)
            setTasksLoaded(true)
        }

    }, [tasks])

    useEffect(() => {
        if (pieOptions.labels.length > 0 && pieOptions.data.length > 0) {
            setPieLoaded(true)
        }
    }, [pieOptions])

    useEffect(() => {
        if (barLabels.length > 0 && barData.length > 0) {
            setBarLoaded(true)
        }
    }, [barData, barLabels])

    useEffect(() => {
        if (bar2Labels.length > 0 && bar2Data.length > 0) {
            setBar2Loaded(true)
        }
    }, [barData, barLabels])

    return (
        <>
            {!loading ?
            <div className="grid grid-cols-8 gap-4 my-8">
                <div className="flex flex-col col-span-2 row-span-2 h-auto ">
                    <div className="flex flex-col bg-white mb-4 h-1/2 rounded-lg">
                        <span className="m-2 font-bold text-3xl">Total Active Projects</span>
                        <h1 className="flex h-full w-full justify-center items-center font-bold text-8xl text-blue">{projects.filter((project) => project.status == 1).length}</h1>
                    </div>
                    <div className="flex flex-col bg-white h-1/2 rounded-lg">
                        <span className="m-2 font-bold text-3xl">Total Active Tasks</span>
                        <h1 className="flex h-full w-full justify-center items-center font-bold text-8xl text-blue">{tasks.filter((task) => task.status == 1).length}</h1>
                    </div>
                </div>
                <div className="col-span-2 row-span-2 h-auto bg-white rounded-lg">
                    {barLoaded
                    ?
                    <>
                        <BarGraph title={"Total Tasks Completed Per Week"} labels={barLabels} data={barData} colors={debuggoBlue}/>
                    </>
                    :
                    <>
                        <Loading/>
                    </>}
                </div>

                <div className="col-span-2 row-span-2 bg-white h-auto rounded-lg">
                    {pieLoaded
                    ?
                    <>
                        <PieChart pieOptions={pieOptions} title={"Project Distribution"} colors={projectColors}/>
                    </>
                    : 
                    <>
                        <Loading/>
                    </>}
                </div>

                <div className="col-span-2 row-span-2 h-auto bg-white rounded-lg">
                    {bar2Loaded
                    ?
                    <>
                        <BarGraph title={"Tasks Completed By Project This Week"} labels={bar2Labels} data={bar2Data} colors={projectColors}/>
                    </>
                    :
                    <>
                        <Loading/>
                    </>}
                </div>
                <div className="col-span-4 bg-white rounded-lg">
                    <UserSection colors={debuggoBlue}/>
                </div>
                {tasksLoaded ? 
                <div className="col-span-4 row-span-3 bg-white rounded-lg">
                    <CardSection cards={tasks} title={"View All Tasks"}/>
                </div>
                :
                <></>}
                <div className="col-span-4 row-span-2 p-4 bg-white rounded-lg">
                    <div className="p-2 rounded-lg w-auto">
                        <span className="m-2 font-bold text-3xl">Task Percentage By Tag</span>
                            <div className="grid grid-cols-2">
                                {allTags.map((tag) => {
                                    return (
                                        <div key={tag}>
                                            <div className="justify-between">
                                                <span className="m-2">{tag}</span>
                                                <div className="flex flex-row">
                                                    <PercentBar percent={Math.round(percentageObject[tag] * 100)}/>
                                                    <span>{Math.round(percentageObject[tag] * 100)}%</span>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                    </div>
                </div>

            </div>
            :
            <Loading/>
            }
        </>
    )
}