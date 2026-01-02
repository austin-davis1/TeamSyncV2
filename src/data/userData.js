import Api from './trackerApi.js'
import config from '../config'

//TODO: Rather than referencing the dev 
//endpoint directly, this would be set according
//to the current NODE_ENV value of 'development' 
//or 'production'. It is hard coded here for
//demonstration purpouses. 
const api = new Api(config.api.dev);

/**
 * Get all users 
 * @returns {Promise<Object[]>} - List of users
 */
export async function getAllUsers(){
    const apiPath = '/users';
    const response = await api.get(apiPath);

    if(response.success){
        return response.data;
    }
    else{
        throw new Error(response.statusText);
    }
}

/**
 * Get a user based on their id
 * @param {string} userId - Id of the user to be retrieved
 * @returns {Promise<Object>} - User specified by the id
 */
export async function getUserById(userId){
    const apiPath = `/users/${userId}`;
    const response = await api.get(apiPath);

    if(response.success){
        return response.data;
    }
    else{
        throw new Error(response.statusText);
    }
}

/**
 * Create a new user
 * @param {Object} newUser - User to be created
 * @returns {Promise}
 */
export async function createUser(newUser){
    console.log(`createUser() newUser: ${JSON.stringify(newUser)}`);
    const apiPath = '/users';
    const response = await api.post(apiPath, JSON.stringify(newUser));

    if(response.success){
        return;
    }
    else{
        throw new Error(response.statusText);
    }
}

/**
 * Update an existing user
 * @param {Object} existingUser - User to be updated
 * @returns {Promise} 
 */
export async function updateUser(existingUser){
    console.log(`updateUser existingUser: ${JSON.stringify(existingUser)}`);
    const apiPath = `/users/${existingUser._id}`;
    const response = await api.put(apiPath, JSON.stringify(existingUser));

    if(!response.success){
        throw new Error(response.statusText);
    }
}

/**
 * Verify a users login information
 * @param {Object} existingUser - User logging in
 * @returns {Promise}
 */
export async function verifyUser(existingUser){
    console.log(`verifyUser ${JSON.stringify(existingUser)}`);
    const apiPath = '/users/login';
    const response = await api.post(apiPath, JSON.stringify(existingUser));

    if(response.success){
        return response.data;
    }
    else{
        throw new Error(response.statusText);
    }
}