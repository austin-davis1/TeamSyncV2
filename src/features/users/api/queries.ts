import { queryOptions } from "@tanstack/react-query"
import { getAllUsers } from "../../../data/userData"

export function createUsersQueryOptions() {
  return queryOptions({
    queryKey: ["users"],
    queryFn: getAllUsers,
  })
}
