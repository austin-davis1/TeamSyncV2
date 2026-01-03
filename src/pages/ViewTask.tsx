import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { updateTask } from "../data/taskData.js"
import { TagButton } from "../components/TagButton.js"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { allTags, type Tag } from "../components/allTags.ts"
import { BackButton } from "../components/BackButton.jsx"
import { createTasksQueryOptions } from "../features/tasks/api/queries.ts"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createUsersQueryOptions } from "../features/users/api/queries.ts"

export default function ViewTask() {
  let { taskId } = useParams()
  const queryClient = useQueryClient()

  const { data: allTasks } = useSuspenseQuery(createTasksQueryOptions())

  const { data: allUsers } = useSuspenseQuery(createUsersQueryOptions())

  const [comment, setComment] = useState<string>()
  const [edit, setEdit] = useState(false)
  const [assign, setAssign] = useState(false)
  const [commentMode, setCommentMode] = useState(false)
  const [error, setError] = useState(false)

  const task = allTasks.find((task) => task._id == taskId)
  if (!task) throw new Error("Task could not be found")
  const {
    title,
    description,
    tags,
    comments,
    dateCreated,
    dateCompleted: dateC,
    estimatedCompletion: estimatedC,
    lastUpdated: lastUp,
    createdBy: creator,
    users,
  } = task

  const date = new Date(dateCreated || "").toISOString().slice(0, 10)
  const dateCompleted = dateC
    ? new Date(dateC || "").toISOString().slice(0, 10)
    : undefined
  const estimatedDate = new Date(estimatedC || "").toISOString().slice(0, 10)
  const lastUpdated = new Date(lastUp || "").toISOString().slice(0, 10)

  const user = sessionStorage?.getItem("User") ?? ""
  const userObj = JSON.parse(user)
  const username = userObj.username

  useEffect(() => {
    if (error) {
      alert("Title and description cannot be blank")
      setError(false)
    }
  }, [error])

  async function handleTagClick(tag: Tag) {
    if (!task) return
    const newTags = tags
      ? tags.includes(tag)
        ? tags?.filter((currentTag) => currentTag !== tag)
        : [...tags, tag]
      : []
    await updateTask({ ...task, tags: newTags })
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }

  async function handleUsers(userClicked: string) {
    const user = allUsers.find((user) => user.name === userClicked)
    if (!user || !task) return
    const newUsers = users
      ? users.find((user) => user.username === userClicked)
        ? users?.filter((user) => user.username !== userClicked)
        : [...users, user]
      : []
    await updateTask({ ...task, users: newUsers })
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }

  function submitEdit() {
    if (!task) return
    if (title === "" || description === "") return setError(true)
    updateTask({
      ...task,
      description,
      lastUpdated: new Date().toLocaleDateString(),
    })
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
    setEdit(false)
  }

  function submitComment() {
    if (!task || !task.comments || !comment) return
    const newComment = {
      commenter: username,
      comment,
      dateCreated: new Date().toLocaleDateString(),
    }

    updateTask({ ...task, comments: [...task.comments, newComment] })
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
    setCommentMode(false)
  }

  function assignTask() {
    let object = task
    if (users.find((user) => user.username == username)) {
      object.users = object.users.filter((user) => user.username != username)
    } else {
      const assignedUser = {
        username,
        email: userObj.email,
      }

      object.users = [...object.users, assignedUser]
    }

    editTask(task._id, object, 1)
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }

  function assignTaskToOthers() {
    const object = { ...task, users: [] }
    object.users = []
    for (let user of assignedUsers) {
      let userObj = allUsers.find((userS) => userS.username == user)
      const { username, email } = userObj
      const appendObject = {
        username,
        email,
      }

      object.users = [...object.users, appendObject]
    }

    editTask(task._id, object, 1)
    queryClient.invalidateQueries({ queryKey: ["tasks"] })
  }

  return (
    <div className="h-auto">
      <BackButton />
      <div className="flex flex-col mt-10 rounded-lg">
        {!edit ? (
          <>
            <div className="flex flex-col w-9/12 h-full p-5 mt-5 ml-5 mr-5 border-solid border-2 border-black rounded-lg group bg-white hover:border-blue">
              <div className="w-full pl-2 bg-blue rounded-lg">
                <h1 className="text-3xl text-white truncate font-bold">
                  {title}
                </h1>
              </div>
              <div className="mt-4">
                <span className="font-bold text-2xl">Bug Description:</span>
                <h2 className="text-lg">{description}</h2>
              </div>
              {tags && (
                <div className="mt-10">
                  {tags.map((tag) => {
                    return <TagButton key={tag} tag={tag} />
                  })}
                </div>
              )}
            </div>
            {task.status == 1 ? (
              <div className="flex flex-row">
                <div
                  className="flex justify-center rounded-lg text-white bg-blue border-solid border-blue cursor-pointer m-5 border-solid border-2 w-48"
                  onClick={() => setEdit(true)}
                >
                  <span>Edit Task</span>
                </div>
                <div
                  className="flex justify-center rounded-lg text-white bg-blue border-solid border-blue cursor-pointer m-5 border-solid border-2 w-48"
                  onClick={() => assignTask()}
                >
                  {users.find((user) => user.username == username) ? (
                    <span>Unassign To Self</span>
                  ) : (
                    <span>Assign To Self</span>
                  )}
                </div>
                {userObj.authorizations.find(
                  (authorization) => authorization == "Admin"
                ) ? (
                  <>
                    <div
                      className="flex justify-center rounded-lg text-white bg-blue border-solid border-blue cursor-pointer m-5 border-solid border-2 w-48 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                      id="menu-button"
                      aria-expanded="true"
                      aria-haspopup="true"
                      onClick={() => setAssign(!assign)}
                    >
                      <span>Assign To Others</span>
                      <svg
                        className="-mr-1 ml-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    {assign ? (
                      <div
                        className="flex absolute ml-96 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                      >
                        <div className="py-1 flex w-full flex-col">
                          {allUsers.map((user) => {
                            return (
                              <button
                                className={
                                  "cursor-pointer hover:bg-off-white block px-4 py-2 " +
                                  (assignedUsers.find(
                                    (userS) => userS == user.username
                                  )
                                    ? "bg-blue"
                                    : " ")
                                }
                                onClick={() => handleUsers(user.username)}
                              >
                                {user.username}
                              </button>
                            )
                          })}
                          <div className="flex flex-row justify-between px-4">
                            <span
                              className="flex justify-center cursor-pointer w-full hover:bg-off-white"
                              onClick={() => assignTaskToOthers()}
                            >
                              Submit
                            </span>
                            <button
                              className="flex justify-center cursor-pointer w-full hover:bg-off-white"
                              onClick={() => setAssign(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col w-9/12 h-full p-5 mt-5 ml-5 mr-5 border-solid border-2 border-black rounded-lg group bg-white hover:border-blue">
              <div className="w-full p-3 bg-blue rounded-lg">
                <input
                  className="text-3xl text-black truncate rounded-lg font-bold p-2"
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={task?.title}
                />
              </div>
              <div className="flex-col flex mt-4">
                <span className="font-bold text-2xl">Bug Description:</span>
                <input
                  className="text-lg border-2 rounded-lg h-24"
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder={task?.description}
                />
              </div>
              <div className="flex flex-row justify-between mt-6">
                <div>
                  {allTags.map((tag) => {
                    return (
                      <button
                        onClick={() => handleTagClick(tag)}
                        className={
                          "w-24 h-12 hover:bg-off-white rounded-lg mr-2 " +
                          (tags.find((ptag) => ptag == tag) ? "bg-blue" : " ")
                        }
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
                <div className="flex flex-row">
                  <button
                    className="flextext-2xl p-2 h-full mr-5 rounded-lg border-blue border-2 hover:border-2 hover:border-black cursor-pointer"
                    onClick={() => submitEdit()}
                  >
                    Submit Edit
                  </button>
                  <button
                    className="flex text-2xl p-2 h-full rounded-lg border-blue border-2 hover:border-2 hover:border-black cursor-pointer"
                    onClick={() => setEdit(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex flex-col w-96 ml-5 mt-5">
          <div className="flex flex-row justify-between mb-3 text-2xl">
            <span className="italic">Date Created: </span>
            <span>{date}</span>
          </div>
          <div className="flex flex-row justify-between mb-3 text-2xl">
            <span className="italic">Estimated Completion</span>
            <span>{estimatedDate}</span>
          </div>
          <div className="flex flex-row justify-between mb-3 text-2xl">
            <span className="italic">Created By: </span>
            <span>{creator}</span>
          </div>
          <div className="flex flex-row justify-between mb-3 text-2xl">
            <span className="italic">Last Updated: </span>
            <span>{lastUpdated}</span>
          </div>
          {task.dateCompleted !== null ? (
            <>
              <div className="flex flex-row justify-between mb-3 text-2xl">
                <span className="italic">Date Completed: </span>
                <span>{dateCompleted}</span>
              </div>
              <div className="flex flex-row justify-between mb-3 text-2xl">
                <span className="italic">Completed By: </span>
                <span>{task.completedBy}</span>
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="flex flex-row justify-between mb-3 text-2xl">
            <span className="italic">Assigned to: </span>
            <div className="flex flex-col grid justify-items-end">
              {users?.map((user) => {
                return <span className="">{user.username}</span>
              })}
            </div>
          </div>
        </div>
        <span className="text-4xl mt-20 ml-5 mb-8">Comments:</span>
        <ul className="ml-5">
          {comments?.map((comment) => {
            return (
              <li className="mb-6 p-2 rounded-xl flex justify-between border-2 w-6/12">
                <div>
                  {comment.commenter} - {comment.comment}
                </div>
                <div>{JSON.stringify(comment.dateCreated)}</div>
              </li>
            )
          })}
        </ul>
        {!commentMode ? (
          <div
            className="border-2 border-blue rounded-lg ml-5 mt-2 justify-center flex w-64 cursor-pointer"
            onClick={() => setCommentMode(true)}
          >
            <div className="flex text-blue w-12 group-hover:text-red-500">
              <AddCircleOutlineIcon sx={{ height: "100%", width: "100%" }} />
            </div>
          </div>
        ) : (
          <div className="rounded-lg ml-5 mt-2 flex flex-col w-64">
            <input
              onChange={(e) => setComment(e.target.value)}
              className="pl-2"
            />
            <div className="flex w-full justify-between">
              <button
                onClick={() => submitComment()}
                className="border-2 border-blue p-2 mt-4"
              >
                Post
              </button>
              <button
                onClick={() => setCommentMode(false)}
                className="border-2 border-blue p-2 mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
