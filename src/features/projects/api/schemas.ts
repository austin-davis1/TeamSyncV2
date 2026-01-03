import { z } from "zod"
import { isoDateString } from "../../tasks/api/schemas"

export const ProjectSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.literal([0, 1]),
  dateCreated: isoDateString,
})

export const ProjectsSchema = z.array(ProjectSchema)
