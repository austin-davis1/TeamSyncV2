import Card from "./Card"
import { useState, useEffect } from "react"
import { allTags } from "./allTags"
import { useSelector } from "react-redux"
import { Loading } from "./LoadingIndicator"
import { Link } from "react-router-dom"

export function CardSection({cards, title}) {
    const [filter, setFilter] = useState("")
    const [selectedTasks, setSelectedTasks] = useState([])
    const [loadingTasks, setLoadingTasks] = useState(true)
    const MAX_TASKS = 3

    useEffect(() => {
        setLoadingTasks(true)
        if (filter.length > 0) {
            setSelectedTasks(cards.filter((card) => card.tags.find((tag) => tag == filter && card.status == 1)))
        } else {
            setSelectedTasks(cards)
        }
        setLoadingTasks(false)
    }, [filter])

    useEffect(() => {
        
    }, [])

    return (
        <div className="flex flex-col w-full h-full rounded-lg p-2">
            <div className="flex flex-row items-center justify-between mb-1">
                <div className="flex flex-row ml-4">
                    <span className="text-3xl font-bold">{title}</span>
                </div>
                <div className="flex flex-row items-center">
                    {title == "View Your Active Tasks" 
                    ?
                        <Link to="/your_tasks" className="border-2 p-2 rounded-lg">View All</Link>
                    :
                    <></>
                    }
                    <span className="mr-4 ml-4 text-2xl">Filter: </span>
                    <div className="flex flex-row items-center">
                    {allTags.map((tag) => {
                        return (
                            <button key={tag} className={"mr-2 p-2 rounded-lg border border-2 " + (filter == tag ? "bg-blue" : "")} onClick={() => setFilter(tag)}>{tag}</button>
                        )
                    })}
                    </div>
                </div>
            </div>
            {!loadingTasks ?
            <div className="flex flex-col">
                {selectedTasks?.slice(0,MAX_TASKS)?.map((card) => {
                    return (
                        <Card issue={card} key={card._id}/>
                    )
                })}
            </div>
            :
            <Loading/>
            }
        </div>
    )
}