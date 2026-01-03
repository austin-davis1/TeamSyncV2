import { z } from "zod"

export const isoDateString = z
  .string()
  .refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Invalid date string",
  })

// optional + nullable helper (Mongo-friendly)
export const nullable = <T extends z.ZodTypeAny>(schema: T) =>
  schema.nullable().optional()

export const CommentSchema = z
  .object({
    commenter: z.string(),
    comment: z.string(),
    dateCreated: isoDateString,
  })
  .or(z.string())

export const UserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
})

export const TaskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  projectId: z.string(),

  dateCreated: isoDateString,
  lastUpdated: isoDateString.nullable().optional(),

  status: z.number(),

  tags: z.array(z.string()).optional(),
  comments: z.array(CommentSchema).optional(),

  createdBy: z.string(),

  users: z.array(UserSchema).optional(),

  dateCompleted: isoDateString.nullable().optional(),
  completedBy: z.string().nullable().optional(),

  estimatedCompletion: isoDateString.nullable().optional(),
})

export const TasksSchema = z.array(TaskSchema)
