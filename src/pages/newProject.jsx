import { useState, useEffect } from "react"
import { createProject} from "../data/projectData.js"
import { useDispatch } from "react-redux"
import { setRefresh } from "../state/reduxActions"
import { Link, useNavigate } from "react-router-dom"

export default function NewProject() {

    const MAX_TITLE_CHARS = 40
    const MAX_DESC_CHARS = 200

    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [error, setError] = useState(null)

    let dispatch = useDispatch()
    const navigate = useNavigate()

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
            object.dateCreated = new Date()
            createProject(object)
            dispatch(setRefresh(true))
            navigate('/projects')
        }
    }

    return (
        <div className="h-auto">
            <Link to="/dashboard">
                    <button className="bg-white mt-5 w-32 h-12 hover:border-4 rounded-lg hover:border-black hover:bg-blue hover:text-white">Back</button>
            </Link>
            <div className = "flex flex-col p-5 text-black mb-5 h-auto rounded-lg bg-off-white">
                <input onChange = {e => setTitle(e.target.value)} placeholder="Title goes here" className="text-2xl p-1 rounded-lg bg-white border-2 border-blue focus:outline-0 focus:shadow-none"></input>
                <span className={"mb-5" + (title.length > MAX_TITLE_CHARS ? " text-red" : "")}>{title.length}/{MAX_TITLE_CHARS}</span>
                <textarea onChange = {e => setDesc(e.target.value)} placeholder="Description goes here" className = "flex-grow text-2xl p-1 rounded-lg bg-white border-2 border-blue focus:outline-0 focus:shadow-none"></textarea>
                <span className={"mb-5" + (desc.length > MAX_DESC_CHARS ? " text-red" : "")}>{desc.length}/{MAX_DESC_CHARS}</span>
                <button onClick={() => submitForm()}>Submit Form</button>
            </div>
        </div>
    )
}