import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

/**
 * The AWS keys are loaded in code here just for the 
 * sake of dev / testing. They are currently being
 * stored in the .env.local file which does not get 
 * published with the repository.
 */
const s3Client = new S3Client({
    region:'us-east-2',
    credentials:{
        accessKeyId:import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey:import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
    }
});
const s3Bucket = 'debuggodevelopment'

/**
 * Upload a file to the debuggo S3 bucket
 * @param {File} file - File object recieved by the input element
 */
export async function uploadFile(file){
    try {
        const bucketParams = {
            Bucket:s3Bucket,
            Key:file.name,
            Body:file
        };

        const data = await s3Client.send(new PutObjectCommand(bucketParams));
        return data;
    }
    catch(err){
        console.log('Storage Service Error', err);
    }
}

/**
 * Get a file from the debuggo S3 bucket
 * @param {string} fileName - The name of the image you want to
 * download.  
 */
export async function getFile(fileName, abortController){
    try{
        const bucketParams = {
            Bucket:s3Bucket,
            Key:fileName
        }

        const response = await s3Client.send(new GetObjectCommand(bucketParams), {abortSignal: abortController?.signal});
        //S3 returns the file as a readable stream. Transform the
        //stream to a base64 string to be used as the image source. 
        const contentType = response.ContentType;
        const srcString = await response.Body?.transformToString('base64');

        /**
         * When using a base64 string as an image source the string needs to 
         * be in the format of "data:{contentType};base64,{base64String}"
         */
        return `data:${contentType};base64,${srcString}`;
    }
    catch(err){
        console.log('Storage Service Error', err);
    }
}

/**
 * Get a file from the debuggo S3 bucket
 * @param {string} fileName - The name of the image you want to
 * download.  
 */
export async function deleteFile(fileName){
    try{
        const bucketParams = {
            Bucket:s3Bucket,
            Key:fileName
        }

        const response = await s3Client.send(new DeleteObjectCommand(bucketParams));
        return response
    }
    catch(err){
        console.log('Storage Service Error', err);
    }
}

export async function getAllFiles(abortController) {
    try{
        const bucketParams = {
            Bucket:s3Bucket
        }

        const response = await s3Client.send(new ListObjectsCommand(bucketParams), {abortSignal: abortController.signal});
        //S3 returns the file as a readable stream. Transform the
        //stream to a base64 string to be used as the image source. 
        //const contentType = response.ContentType;
        //const srcString = await response.Body?.transformToString('base64');

        const responseBody = response
        const responseContents = responseBody.Contents

        let photo
        
        let returnImages = []
        for (let image of responseContents) {
            let photoObject = {}
            photo = await getFile(image.Key, abortController)
            photoObject.photo = photo
            photoObject.key = image.Key
            returnImages.push(photoObject)
        }
        console.log("Return Images")
        console.log(returnImages)
        return returnImages;
    }
    catch(err){
        console.log('Storage Service Error', err);
    }
}