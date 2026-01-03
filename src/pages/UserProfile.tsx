import { useState, useEffect } from "react"
import { uploadFile, getFile, deleteFile } from "../data/storageService.js"
import { updateUser } from "../data/userData.js"
import picture from "../assets/no_profile_picture.svg"

import { ProfilePicture } from "../components/ProfilePic.jsx"

export function UserProfile() {

    const [photo, setPhoto] = useState([])

    let user = sessionStorage.getItem("User")
    let userObj = JSON.parse(user)
    let joinDate = new Date(userObj.dateJoined)
    
    const MAX_FILE_SIZE = 1000000

    /**
     * To get the shortened date you can also use
     * .toLocaleDateString('en-US'). 
     * ex: If the join date is Feb 2nd, then 
     * joinDate.toLocaleDateString('en-US') = 2/2/2023
     * The timezone automatically gets inferred by the users 
     * browser agent timezone. 
     */
    let dateString = joinDate.toLocaleDateString('en-US');

    async function onProfileImageUpload(e) {
        const file = e.target.files[0];

        if(file){
            try {
                //Name the file profile_{userId}.ext. This will ensure
                //there are no naming collisions with the file names, plus 
                //will ensure each user only has one profile picture stored on
                //s3. 
                
                if (file.size > MAX_FILE_SIZE) {
                    throw new Error("File size is too large.")
                }

                //Break the file name into pieces using .substring. We use 
                //lastIndexOf instead of indexOf just in case the file name 
                //has multiple periods. We only care about the last one. 
                const fileExtension = file.name.substring(file.name.lastIndexOf('.'));

                if (fileExtension != ".jpg") {
                    throw new Error("Files must be .jpg")
                }
                const newFileName = `profile_${userObj._id}${fileExtension}`;

                //The .name property on a File object is readonly, so we need to 
                //create a new file with the new name. (There is probably a better 
                //way to accomplish the rename)
                const newFile = new File([file], newFileName, {
                    type:file.type,
                    lastModified:file.lastModified
                });

                //TODO: Show the user some type of "working" modal
                //while the file is being uploaded and the user object
                //is updated.

                //Delete the old profile picture
                //if (file.name.substring(file.name.lastIndexOf('.') == "")
                await deleteFile(newFileName)
                console.log("Old file has been deleted.")

                await uploadFile(newFile);
                console.log("FILE HAS BEEN UPLOADED!!!");

                //Once the file has been uploaded, clear
                //out the input element so it does not keep
                //showing the file selected
                e.target.value = '';

                //After the file has been successfully uploaded, update the
                //user object to reflect the change. 
                userObj.pictureID = newFileName;
                await updateUser(userObj);
                sessionStorage.setItem("User", JSON.stringify(userObj))
                
            } catch (error) {
                console.log("Error uploading file: ", error);
            }
        }
    }

    useEffect(() => {
        async function loadProfilePhoto () {
            //If a valid image is found, show it, otherwise
            //default to the no photo svg icon.
            let photoSrc = picture;
            if(userObj && userObj.pictureID){
                photoSrc = await getFile(userObj.pictureID);
            }
            
            setPhoto(photoSrc);
        }
        loadProfilePhoto()
    }, [])

    return (
        <div className="h-screen">
            <div className="flex h-86 mt-4">
                <div className="w-64">
                    <ProfilePicture image={photo}/>
                </div>
                <div className="ml-48">
                    <h1 className="text-6xl text-blue">{userObj.username}</h1>
                    <h1 className="text-2xl mt-16">{userObj.name}</h1>
                    <h1 className="text-2xl">Contact: {userObj.email}</h1>
                    <h1 className="text-xl">Date Joined: {dateString}</h1>
                </div>
            <input type="file" onChange={onProfileImageUpload}/>
            </div>
            <div className="w-full border-solid border-2 mt-6 border-blue">
                
            </div>
        </div>
    )
}