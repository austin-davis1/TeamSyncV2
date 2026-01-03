import { queryOptions } from "@tanstack/react-query"
import { getAllUsers } from "../../../data/userData"
import { getAllFiles } from "../../../data/storageService"

export function createUsersQueryOptions() {
  return queryOptions({
    queryKey: ["users"],
    queryFn: getAllUsers,
  })
}

export function createProfileImageQueryOptions() {
  return queryOptions({
    queryKey: ["profileImages"],
    queryFn: getAllFiles,
  })
}
