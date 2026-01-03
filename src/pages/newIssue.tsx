import { useState, useEffect } from "react"
import { createTask } from "../data/taskData.js"
import { useDispatch } from "react-redux"
import { setRefresh } from "../state/reduxActions"
import { Link, useNavigate, useParams } from "react-router-dom"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

export default function NewIssue() {
    const MAX_TITLE_CHARS = 50
    const MAX_DESC_CHARS = 300

    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [error, setError] = useState(null)
    const [tags, setTags] = useState([])
    const [startDate, setStartDate] = useState(new Date())

    const allTags = [
        "Urgent",
        "Priority",
        "Bug",
        "Upgrade",
        "Question",
        "Help Needed"
    ]

    console.log(tags)

    let dispatch = useDispatch()
    const navigate = useNavigate()

    let { projectId } = useParams()

    let user = sessionStorage.getItem("User")
    let userObj = JSON.parse(user)
    let username = userObj.username

    useEffect(() => {
        if (error == "Empty") {
            alert("Title and description cannot be blank")
        } else if (error == "Full_Title") {
            alert("Title can be no more than 40 characters")
        } else if (error == "Full_Desc") {
            alert("Description can be no more than 100 characters.")
        }
        setError(null)
    }, [error])

    function handleClick(tag) {
        if (tags.find(ptag => ptag == tag)) {
            setTags(current => current.filter(ptag => {return ptag !== tag}))
        }
        else {
            setTags([...tags,tag])
        }
    }

    async function submitForm() {
        if (title === "" || desc === "") {
            setError("Empty")
        } else if (title.length > MAX_TITLE_CHARS) {
            setError("Full_Title")
        }
          else if (desc.length > MAX_DESC_CHARS) {
            setError("Full_Desc")
        }
        else {
            let object = {}
            object.title = title
            object.description = desc
            object.projectId = projectId
            object.dateCreated = new Date()
            object.lastUpdated = new Date()
            object.dateCompleted = null
            object.estimatedCompletion = startDate
            object.createdBy = username
            object.tags = tags
            object.comments = []
            object.users = []
            createTask(object)
            dispatch(setRefresh(true))
            navigate(`/projects/view_project/${projectId}`)
        }
    }

    function handleClick(tag) {
        if (tags.find(ptag => ptag == tag)) {
            setTags(current => current.filter(ptag => {return ptag !== tag}))
        }
        else {
            setTags([...tags,tag])
        }
    }

    console.log(startDate)

    return (
        <div className="h-auto">
            <Link to={`/projects/view_project/${projectId}`}>
                    <button className="bg-white mt-5 w-32 h-12 hover:border-4 rounded-lg hover:border-black hover:bg-blue hover:text-white">Back</button>
            </Link>
            <div className = "flex flex-col p-5 text-black mt-5 h-auto rounded-lg bg-off-white">
                <input onChange = {e => setTitle(e.target.value)} placeholder="Title goes here" className="text-2xl p-1 rounded-lg bg-white focus:outline-0 focus:shadow-none border-2 border-blue"></input>
                <span className={"mb-5" + (title.length > MAX_TITLE_CHARS ? " text-red" : "")}>{title.length}/{MAX_TITLE_CHARS}</span>
                <textarea onChange = {e => setDesc(e.target.value)} placeholder="Description goes here" className = "flex-grow text-2xl p-1 rounded-lg bg-white focus:outline-0 border-2 border-blue focus:shadow-none"></textarea>
                <span className={"mb-5" + (desc.length > MAX_DESC_CHARS ? " text-red" : "")}>{desc.length}/{MAX_DESC_CHARS}</span>
                <button onClick={() => submitForm()}>Submit Form</button>
            </div>
            <div classname="flex grid grid-cols-2 gap-2">
                {allTags.map(tag => {
                    return (<button onClick={() => handleClick(tag) } className={"w-24 h-12 rounded-lg mr-4 hover:bg-white " + (tags.find((ptag) => ptag == tag) ? "bg-blue" : " ")}>{tag}</button>)
                })}
            </div>
            <div className="mt-8 mb-4">
                <span className="flex font-bold text-xl">Select Estimated Completion Date:</span>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            </div>
        </div>
    )
}