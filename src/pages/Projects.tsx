import { Link } from "react-router-dom"
import { updateProject, deleteProject } from "../data/projectData.ts"
import { useState, type Dispatch, type SetStateAction } from "react"
import { Loading } from "../components/LoadingIndicator"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createProfileImageQueryOptions,
  createUsersQueryOptions,
} from "../features/users/api/queries.ts"
import { ProjectCard } from "../components/projectCard.tsx"
import { createProjectsQueryOptions } from "../features/projects/api/queries.ts"

export default function Projects() {
  const queryClient = useQueryClient()

  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState()

  async function handleEvent(id) {
    let data = projects.find((project) => project._id == id)

    if (modalType == "Delete") {
      await deleteProject(id)
    } else {
      data.status = 0
      await updateProject(data)
    }

    queryClient.invalidateQueries({ queryKey: ["projects"] })
    setShowModal(false)
  }

  const { data: projects } = useQuery(createProjectsQueryOptions())

  const { data: users, isPending: usersLoading } = useQuery(
    createUsersQueryOptions()
  )
  const { data: profilePictures, isPending: imagesLoading } = useQuery(
    createProfileImageQueryOptions()
  )

  return (
    <div className="h-auto">
      {modalType ? (
        <DeleteModal
          modalType={modalType}
          setShowModal={setShowModal}
          handleEvent={handleEvent}
        />
      ) : (
        <div className="flex flex-col w-full">
          <>
            {!imagesLoading && !usersLoading ? (
              projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  profilePictures={profilePictures}
                  profileUsers={users}
                />
              ))
            ) : (
              <>
                <Loading />
              </>
            )}
            <Link
              to="new_project"
              className="flex justify-center bg-white border-solid border-2 border-black rounded-lg p-4 mt-6 mb-6 hover:bg-off-white cursor-pointer"
            >
              <h1 className="text-4xl justify-center">New Project</h1>
            </Link>
          </>
        </div>
      )}
    </div>
  )
}

function DeleteModal({
  modalType,
  setShowModal,
  handleEvent,
}: {
  modalType: string
  setShowModal: Dispatch<SetStateAction<boolean>>
  handleEvent: (id: string) => void
}) {
  return (
    <>
      <div className="flex justify-center items-center">
        <h1>Are you sure you want to {modalType} this bug?</h1>
      </div>
      <div className="grid grid-cols-2 justify-items-center items-center">
        <h1
          onClick={() => handleEvent(deleteId)}
          className="cursor-pointer w-36 h-12 text-center font-bold bg-green rounded-lg"
        >
          Yes
        </h1>
        <h1
          onClick={() => setShowModal(false)}
          className="cursor-pointer w-36 h-12 text-center font-bold bg-red rounded-lg"
        >
          No
        </h1>
      </div>
    </>
  )
}
