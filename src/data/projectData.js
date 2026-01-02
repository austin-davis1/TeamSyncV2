import Api from './trackerApi.js'
import config from '../config'

import { getTasksByProjectId, updateTask } from './taskData.js'

//TODO: Rather than referencing the dev 
//endpoint directly, this would be set according
//to the current NODE_ENV value of 'development' 
//or 'production'. It is hard coded here for
//demonstration purpouses. 
const api = new Api(config.api.dev);

/**
 * Retrieve all projects from the api.
 * @returns {Promise<Object[]>} - The complete list 
 * of projects in the db. 
 */
export async function getAllProjects(){
    const apiPath = '/projects';
    const response = await api.get(apiPath);

    if(response.success){
        return response.data;
    }
    else{
        throw new Error(response.statusText);
    }
}

/**
 * Create a new project. 
 * @param {Object} newProject - Project to be created 
 * @returns {Promise}
 */
export async function createProject(newProject){
    const apiPath = '/projects';
    const response = await api.post(apiPath, JSON.stringify(newProject));

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
 * Update an existing project. 
 * @param {Object} existingProject - Project to be updated 
 * @returns {Promise}
 */
export async function updateProject(existingProject){
    const apiPath = `/projects/${existingProject._id}`;
    const response = await api.put(apiPath, JSON.stringify(existingProject));

    //For an update, the client should already have
    //a copy of the updated object, so we only return
    //something from this request if there is an error
    //during the update.
    if(!response.success){
        throw new Error(response.statusText);
    }
}

export async function completeProject(existingProject){
    existingProject.status = 0;

    await updateProject(existingProject);

    //TODO: Rather than updating each task individually,
    //this can be replaced by a call to the api that runs
    //the .updateMany() command.
    const projectTasks = await getTasksByProjectId(existingProject._id);
    if(projectTasks 
        && Array.isArray(projectTasks)
        && projectTasks.length > 0){

        for(let i=0; i<=projectTasks.length; i++){
            projectTasks[i].status = 0;
            await updateTask(projectTasks[i]);
        }
    }
}

/**
 * Delete an existing project
 * @param {string} projectId - Id of the project to be deleted 
 * @returns {Promise}
 */
export async function deleteProject(projectId){
    const apiPath = `/projects/${projectId}`;
    const response = await api.delete(apiPath, projectId);

    //Similar to the update above, we only care about the 
    //response if there is an error. 
    if(!response.success){
        throw new Error(response.statusText);
    }
}