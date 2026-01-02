import express from "express"
import cors from "cors"
import tasks from "./taskRoutes.js"
import projects from "./projectRoutes.js"
import users from "./userRoutes.js"
import connect from "./connect.js"
import dotenv from "dotenv"

dotenv.config()
const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use(tasks)
app.use(projects)
app.use(users)
// get driver connection
const dbo = connect

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer((err) => {
    if (err) console.error(err)
  })
  console.log(`Server is running on port: ${port}`)
})
