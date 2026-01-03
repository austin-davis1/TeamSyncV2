import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export function UpcomingTasks({tasks, title}) {

    const MAX_TASKS = 5
    const [shownTasks, setShownTasks] = useState([])

    useEffect(() => {
        setShownTasks(tasks)
    }, [])

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex flex-row ml-4">
                <span className="text-3xl font-bold">{title}</span>
            </div>
            <table className="ml-2 table-auto border-separate border-spacing-x-4 border-spacing-y-2">
                <thead>
                    <tr className="bg-blue text-white">
                        <th className="border rounded-lg">Task</th>
                        <th className="border rounded-lg">Date Created</th>
                        <th className="border rounded-lg">Estimated Completion</th>
                    </tr>
                </thead>
                <tbody>
                    {shownTasks.sort((a, b) => {
                        let estimatedDate1 = new Date(a.estimatedCompletion)
                        let estimatedDate2 = new Date(b.estimatedCompletion)
                        //console.log(estimatedDate)
                        //console.log(estimatedDate.getTime())
                        return estimatedDate1.getTime() - estimatedDate2.getTime()
                    }).slice(0, MAX_TASKS).map((task) => {
                        return (
                            <>
                                <tr className="h-16">
                                    <td className="border border-2 rounded-lg border-blue hover:bg-off-white">
                                        <div className="flex w-full h-full">
                                            <Link to={`/projects/view_project/${task.projectId}/view_task/${task._id}`} className="flex w-full h-full font-bold text-2xl p-2">
                                                {task.title.slice(0, 25)}...
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="text-lg">
                                        <div className="flex justify-center">
                                            {task.dateCreated.slice(0,10)}
                                        </div>
                                    </td>
                                    <td className="text-lg">
                                        <div className="flex font-bold justify-center">
                                            {task.estimatedCompletion.slice(0,10)}
                                        </div>
                                    </td>
                                </tr>
                            </>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}