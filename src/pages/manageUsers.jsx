import { getAllUsers } from '../data/userData.js'
import { useEffect, useState } from "react"
import { UserTag } from "../components/UserTag"
import { Link } from "react-router-dom"

export function ManageUsers() {

    const [loadingUsers, setLoadingUsers] = useState(true)
    const [users, setUsers] = useState([])

    const controller = new AbortController()

    useEffect(() => {
        async function pullUsers() {
            let allUsers = await getAllUsers(controller)
            setLoadingUsers(true)
            setUsers(allUsers)
        }
        pullUsers()
    })

    return (
        <div className="w-6/12">

            {loadingUsers 
            ?
                <>
                    <div className="flex m-2 font-bold flex-row justify-between">
                        <span>Username</span>
                        <span>Name</span>
                        <span>Authorization</span>
                        <span>Email</span>
                    </div>
                    <div>
                        {users.map((user) => {
                            return (
                                <>
                                    <UserTag user={user} key={user._id}/>
                                    
                                </>
                            )
                        })}
                    </div>
                </>
            :
            <>
                <h1>Loading data...</h1>
            </>
            }
        </div>
    )
}