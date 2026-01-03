import { queryOptions } from "@tanstack/react-query"
import { getAllTasks } from "../../../data/taskData"

export function createTasksQueryOptions() {
  return queryOptions({
    queryKey: ["tasks"],
    queryFn: getAllTasks,
  })
}
