const express = require("express")
const bcrypt = require('bcrypt')

const saltRounds = 7;

const userRoutes = express.Router();
 
//db access
const dbo = require('./connect');

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

/**
 * Get all users
 */
userRoutes.route("/users").get(function (request, response) {
  let db_connect = dbo.getDb();
  db_connect
    .collection("Users")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      response.json(result);
    });
});

/**
 * Get a user based on their user id.
 */
userRoutes.route("/users/:id").get(function (request, response) {
    let db_connect = dbo.getDb(); 
    let myquery = { _id: ObjectId(request.params.id) };
    
    db_connect
        .collection("Users")
        .findOne(myquery, function (err, dbResult) {
            if (err) throw err;
            response.json(dbResult);
    });
});

/**
 * Create / Register a new user
 */
userRoutes.route("/users").post(async function (request, response) {
  let db_connect = dbo.getDb();

  const takenUsername = await db_connect.collection("Users").findOne({username: request.body.username})
  const takenEmail = await db_connect.collection("Users").findOne({email: request.body.email})

  if (takenUsername || takenEmail) {
    response.json({message: "Username or email has already been taken"})
  }

  else {
    let hash = await bcrypt.hash(request.body.password, saltRounds)
    console.log(hash)

    let newUser = {
      username: request.body.username,
      name: request.body.name,
      email: request.body.email,
      password: hash,
      dateJoined: request.body.dateJoined,
      authorizations: request.body.authorizations,
      assignedTasks: request.body.assignedTasks,
      pictureID: request.body.pictureID
    };
    db_connect.collection("Users").insertOne(newUser, function (err, dbResult) {
      if (err) throw err;
      response.json(dbResult);
    });
  }
});

/**
 * Update an existing user. A successful update returns 
 * an http 204 (No Content) response which is a standard 
 * response for a .put (e.g. update) request. The client already
 * has a copy of the updated object, so it only needs to know
 * if the update was completed. It doesn't need a new copy. 
 * If the 'matchedCount' property on the dbResult isn't 1, 
 * the user record was not found. When that happens return an 
 * http 400 (BadRequest). If some other type of error occurs, 
 * (i.e. the connection to the db fails) return an http 500 (Internal Server Error)
 * 
 * Note: Some will argue that you should return an http 404 (Not Found) 
 * when trying to update a record that doesn't exist. I disagree with this 
 * because the 404 is ambiguous. From the client side, you see a 404 and don't 
 * know if its because the url is wrong and the route doesn't exist or 
 * if its the user id that is wrong. To find out, you would have to look at
 * the body hoping it specifies exactly what was "not found".
 */
userRoutes.route('/users/:id').put(async function(request,response){
    let db_connect = dbo.getDb();
    let myQuery = { _id: ObjectId(request.params.id) };

    try{
        const dbResult = await db_connect.collection('Users')
          .updateOne(myQuery, 
              {
                  $set:{
                      username:request.body.username,
                      name:request.body.name,
                      email:request.body.email,
                      password:request.body.password,
                      dateJoined:request.body.dateJoined,
                      authorizations:request.body.authorizations,
                      assignedTasks:request.body.assignedTasks,
                      pictureID:request.body.pictureID
                  }
              });
      
      if(dbResult.matchedCount === 1){
        response.status(204).send();
      }
      else{
        response.status(400).send(`Update failed. User with id ${request.params.id} was not found.`);
      }
    }
    catch(err){
      response.status(500).send(`Error: ${err.message}`);
    }
});

/**
 * Verify a user login
 */
userRoutes.route("/users/login").post(async function (request, response) {
    let db_connect = dbo.getDb();
  
    const userObj = await db_connect.collection("Users").findOne({email: request.body.email})

    if (userObj) {
        let confirmation = await bcrypt.compare(request.body.password, userObj.password)
        console.log(confirmation)
        response.json({success: confirmation, userObj})
    } else {
        console.log("No email was found")
        response.json({success: false, message: "No email was found"})
    }
});

module.exports = userRoutes;
