const express = require("express")

// taskRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const taskRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("./connect");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Retrieve All Tasks
taskRoutes.route("/tasks").get((request, response) => {
    let db_connect = dbo.getDb();
    db_connect.collection("Tasks")
        .find({})
        .toArray((err, result) => {
            if (err) throw err;
            response.json(result);
        });
});
   
// Retrieve a task by its id
taskRoutes.route("/tasks/:id").get((request, response) => {
    let db_connect = dbo.getDb(); 
    let myquery = { _id: ObjectId(request.params.id) };
    db_connect.collection("Tasks")
        .findOne(myquery, (err, result) => {
            if (err) throw err;
            response.json(result);
        });
});
    
// Create Task
taskRoutes.route("/tasks").post((request, response) => {
    let db_connect = dbo.getDb();
    let myobj = {
        title: request.body.title,
        description: request.body.description,
        projectId: request.body.projectId,
        dateCreated: request.body.dateCreated,
        comments: request.body.comments,
        createdBy: request.body.createdBy,
        lastUpdated: request.body.lastUpdated,
        dateCompleted: request.body.dateCompleted,
        estimatedCompletion: request.body.estimatedCompletion,
        completedBy: request.body.completedBy,
        tags: request.body.tags,
        users: request.body.users,
        status: 1,
    };

    db_connect.collection("Tasks")
        .insertOne(myobj, (err, result) => {
            if (err) throw err;
            response.json(result);
        });
});
   
// Update a single task
taskRoutes.route("/tasks/:id").put((request, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(request.params.id) };
    let newvalues = {
    $set: {
            title: request.body.title,
            description: request.body.description,
            dateCreated: request.body.dateCreated,
            projectId: request.body.projectId,
            tags: request.body.tags,
            comments: request.body.comments,
            createdBy: request.body.createdBy,
            lastUpdated: request.body.lastUpdated,
            dateCompleted: request.body.dateCompleted,
            completedBy: request.body.completedBy,
            estimatedCompletion: request.body.estimatedCompletion,
            users: request.body.users,
            status: request.body.status,
        },
    };

    db_connect.collection("Tasks")
        .updateOne(myquery, newvalues, (err, result) => {
            if (err) throw err;
            console.log("1 task updated");
            response.json(result);
        });
});
   
// Delete task
taskRoutes.route("/tasks/:id").delete((request, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(request.params.id) };
    db_connect.collection("Tasks")
        .deleteOne(myquery,(err, result) => {
            if (err) throw err;
            console.log("1 document deleted");
            response.json(result);
        });
});

module.exports = taskRoutes;