import { queryOptions } from "@tanstack/react-query"
import { getAllProjects } from "../../../data/projectData"

export function createProjectsQueryOptions() {
  return queryOptions({
    queryKey: ["projects"],
    queryFn: getAllProjects,
  })
}
