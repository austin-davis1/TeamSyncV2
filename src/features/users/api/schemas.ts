import { z } from "zod"
import { isoDateString, nullable } from "../../tasks/api/schemas"

export const UserSchema = z.object({
  _id: z.string(),
  username: z.string(),
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string(),
  dateJoined: isoDateString,
  authorizations: z.array(z.string()),
  assignedTasks: z.array(z.string()),
  pictureID: nullable(z.string()),
})

export const UsersSchema = z.array(UserSchema)
