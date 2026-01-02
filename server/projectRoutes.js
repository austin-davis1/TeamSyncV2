const express = require("express")

// projectRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const projectRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("./connect");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Retrieve All Projects
projectRoutes.route("/projects").get((request, response) => {
    let db_connect = dbo.getDb();
    db_connect
        .collection("Projects")
        .find({})
        .toArray((err, result) => {
            if (err) throw err;
            response.json(result);
    });
});

// Retrieve a project by its id
projectRoutes.route("/projects/:id").get((request, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(request.params.id) };
    db_connect
        .collection("Projects")
        .findOne(myquery, function (err, dbResult) {
            if (err) throw err;
            response.json(dbResult);
    });
});

// Retrieve a list of tasks attached to a particular project
projectRoutes.route("/projects/:id/tasks").get((request, response) => {
    let db_connect = dbo.getDb();
    db_connect
        .collection("Tasks")
        .find({
            projectId:request.params.id
        })
        .toArray((err, result) => {
            if (err) throw err;
            response.json(result);
    });
});

// Create Project
projectRoutes.route("/projects").post((request, response) => {
    let db_connect = dbo.getDb();
    let myobj = {
        title: request.body.title,
        description: request.body.description,
        dateCreated: request.body.dateCreated,
        status: 1,
    };
    db_connect.collection("Projects").insertOne(myobj, (err, result) => {
        if (err) throw err;
        response.json(result);
    });
});
   
// Update Project
projectRoutes.route("/projects/:id").put((request, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(request.params.id) };
    let newvalues = {
        $set: {
            title: request.body.title,
            description: request.body.description,
            dateCreated: request.body.dateCreated,
            status: request.body.status,
        },
    };
    db_connect
        .collection("Projects")
        .updateOne(myquery, newvalues, (err, result) => {
            if (err) throw err;
            console.log("1 project updated");
            response.json(result);
    });
});
   
// Delete Project
projectRoutes.route("/projects/:id").delete((request, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId(request.params.id) };
    db_connect.collection("Projects").deleteOne(myquery, (err, result) => {
        if (err) throw err;
        console.log("1 project deleted");
        response.json(result);
    });
});

module.exports = projectRoutes;