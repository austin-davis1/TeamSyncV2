import { Link } from "react-router-dom"

export function UserTag({user}) {
    return (
        <div className="border-2 h-12 pl-2 pr-2 items-center border-blue mb-4 rounded-lg flex flex-row justify-between">
            <div>{user.username}</div>
            <div>{user.name}</div>
            <div>{user.authorizations[0]}</div>
            <div>{user.email}</div>
            <Link to={`/user_tasks/${user._id}`}>View User Tasks</Link>
        </div>
    )
}