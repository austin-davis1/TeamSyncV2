import { useState, useEffect } from "react"
import { getUserById, verifyUser, createUser } from '../data/userData.js'
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import Logo from "../assets/bug_tracker.png"
import { setDashboardView, setLoggedIn } from "../state/reduxActions.js"

export function Landing() {

    const navigate = useNavigate()
    let dispatch = useDispatch()

    const [create, setCreate] = useState(false)
    const [formError, setFormError] = useState(false)
    const [error, setError] = useState(false)
    const [incorrect, setIncorrect] = useState(false)

    //Login state
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    //Creation State
    const [userCreate, setUserCreate] = useState("")
    const [name, setName] = useState("")
    const [emailCreate, setEmailCreate] = useState("")
    const [passwordCreate, setPasswordCreate] = useState("")

    useEffect(() => {
        if (formError) {
            alert("All fields must be filled out")
            setFormError(false)
        } else if (error) {
            alert("Something went wrong with submission :(")
            setError(false)
        }
    }, [formError, error])

    async function handleLogin() {
        if (email == "" || password == "") {
            setFormError(true)
        } else {
            let userObject = { }
            userObject.email = email
            userObject.password = password
            let response = await verifyUser(userObject)
            if (response.success == true) {
                let user = response.userObj
                //dispatch(setUser(user))
                sessionStorage.setItem("User", JSON.stringify(user))
                sessionStorage.setItem("View", (user.authorizations[0]).toString())
                //sessionStorage.setItem("CurrentAuthorization", "Admin")
                dispatch(setDashboardView(user.authorizations[0]))
                
                dispatch(setLoggedIn(true))
                navigate("/dashboard")
            } else {
                alert("The information was not correct")
            }
        }
    }

    async function handleCreation() {
        if (userCreate == "" || emailCreate == "" || passwordCreate == "") {
            setFormError(true)
        } else {
            let userObj = {}
            userObj.username = userCreate
            userObj.name = name
            userObj.email = emailCreate
            userObj.password = passwordCreate
            userObj.dateJoined = new Date()
            userObj.authorizations = ["User"]
            userObj.assignedTasks = []

            const newUser = await createUser(userObj);

            if (newUser){
                setCreate(false)
            } else{
                setError(true)
            }
        }
    }

    return(
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="flex flex-col bg-off-white border-2 border-blue pb-6 rounded-lg mt-6 w-3/12">
                    <div className="w-full flex justify-center border-4 border-off-white bg-white rounded-lg">
                        <img src={Logo} alt="logo" className="mt-2 w-6/12 flex justify-center"/>
                    </div>
                    {!create ? <>
                    <h1 className="flex justify-center text-4xl m-2">Sign-In</h1>
                    <h1 className="text-2xl m-2">Email:</h1>
                    <input className="m-2 pl-4 rounded-lg h-8" placeholder="Email" onChange = {e => setEmail(e.target.value)}></input>
                    <h1 className="text-2xl m-2">Password:</h1>
                    <input className="m-2 pl-4 rounded-lg h-8" type="password" placeholder="Password" onChange = {e => setPassword(e.target.value)}></input>
                    <div className = "flex flex-col w-full justify-center mt-4">
                        <div className="flex justify-center w-full">
                            <span className = "flex p-2 rounded-lg justify-center w-9/12 h-full items-center opacity-90 bg-green text-2xl cursor-pointer hover:bg-hover-gray hover:border-solid hover:border-blue hover:border-2" onClick={() => handleLogin()}>Login</span>
                        </div>
                        <div className = "flex justify-center w-full">
                            <span className = "flex mt-4 rounded-lg justify-center w-9/12 h-full items-center opacity-90 bg-blue text-2xl cursor-pointer hover:bg-hover-gray" onClick={() => setCreate(true)}>Create Account</span>
                        </div>
                    </div>
                    </>
                    :
                    <>
                        <h1 className="text-4xl m-2">Create Account</h1>
                        <h1 className="text-2xl m-2">Username:</h1>
                        <input className="m-2 pl-4 rounded-lg h-8" placeholder="Username" onChange = {e => setUserCreate(e.target.value)}></input>
                        <h1 className="text-2xl m-2">Name:</h1>
                        <input className="m-2 pl-4 rounded-lg h-8" placeholder="Name" onChange = {e => setName(e.target.value)}></input>
                        <h1 className="text-2xl m-2">Email:</h1>
                        <input className="m-2 pl-4 rounded-lg h-8" placeholder="Email" onChange = {e => setEmailCreate(e.target.value)}></input>
                        <h1 className="text-2xl m-2">Password:</h1>
                        <input className="m-2 pl-4 rounded-lg h-8"placeholder="Password" onChange = {e => setPasswordCreate(e.target.value)}></input>
                        <div className = "flex flex-col w-full justify-center mt-4">
                            <div className="flex justify-center w-full">
                                <span className = "flex p-2 rounded-lg justify-center w-9/12 h-full items-center opacity-90 bg-green text-2xl cursor-pointer hover:bg-hover-gray hover:border-solid hover:border-blue hover:border-2" onClick={() => handleCreation()}>Create</span>
                            </div>
                            <div className="flex justify-center w-full">
                                <span className = "flex mt-4 rounded-lg justify-center w-9/12 h-full items-center opacity-90 bg-red text-2xl cursor-pointer hover:bg-hover-gray" onClick={() => setCreate(false)}>Cancel</span>
                            </div>
                        </div>
                    </>
                    }
                </div>
            </div>
        </>
    )
}