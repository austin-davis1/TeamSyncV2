// connect.js
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const Db = process.env.ATLAS_URI

const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let _db

export const connectToServer = function (callback) {
  client.connect(function (err, db) {
    // Verify we got a good "db" object
    if (db) {
      _db = db.db("BugTrackerData")
      console.log("Successfully connected to MongoDB.")
    }
    return callback(err)
  })
}

export const getDb = function () {
  return _db
}

// Default export (for your current import style)
export default {
  connectToServer,
  getDb,
}
