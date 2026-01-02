import Api from './trackerApi.js'
import config from '../config'

//TODO: Rather than referencing the dev 
//endpoint directly, this would be set according
//to the current NODE_ENV value of 'development' 
//or 'production'. It is hard coded here for
//demonstration purpouses. 
const api = new Api(config.api.dev);

/**
 * Retrieve all tasks from the api.
 * @returns {Promise<Object[]>} - The complete array
 * of tasks in the db. 
 */
export async function getAllTasks(){
    const apiPath = '/tasks';
    const response = await api.get(apiPath);

    if(response.success){
        return response.data;
    }
    else{
        throw new Error(response.statusText);
    }
}

/**
 * Retrieve all tasks belonging to a specified project
 * @param {string} projectId - Id of the project the tasks are attached to 
 * @returns {Promise<Object[]>} - Array of tasks for the specified project
 */
export async function getTasksByProjectId(projectId){
    const apiPath = `/projects/${projectId}/tasks`;
    const response = await api.get(apiPath);

    if(response.success){
        return response.data;
    }
    else{
        throw new Error(response.statusText);
    }
}

/**
 * Create a new task. 
 * @param {Object} newTask - Task to be created 
 * @returns {Promise}
 */
export async function createTask(newTask){
    const apiPath = '/tasks';
    const response = await api.post(apiPath, JSON.stringify(newTask));

    if(response.success){
        //TODO: Normally when you create a new entity, you want to 
        //at least return the id of the new entity in the event you 
        //want to navigate to it. 
        return;
    }
    else{
        throw new Error(response.statusText);
    }
}

/**
 * Update an existing task. 
 * @param {Object} existingTask - Task to be updated 
 * @returns {Promise}
 */
export async function updateTask(existingTask){
    const apiPath = `/tasks/${existingTask.id}`;
    const response = await api.put(apiPath, JSON.stringify(existingTask));

    //For an update, the client should already have
    //a copy of the updated object, so we only return
    //something from this request if there is an error
    //during the update.
    if(!response.success){
        throw new Error(response.statusText);
    }
}

/**
 * Delete an existing task
 * @param {string} taskId - Id of the task to be deleted 
 * @returns {Promise}
 */
export async function deleteTask(taskId){
    const apiPath = `/tasks/${taskId}`;
    const response = await api.delete(apiPath, taskId);

    //Similar to the update above, we only care about the 
    //response if there is an error. 
    if(!response.success){
        throw new Error(response.statusText);
    }
}