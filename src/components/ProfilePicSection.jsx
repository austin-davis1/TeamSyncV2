import { ProfilePicture } from "./ProfilePic"

export function ProfilePictureSection({images}) {
    let imageCount = images.length
    const MAX_IMAGES = 4

    return (
        <>
            <div className="flex flex-row mx--2 w-96 h-16">
                {images.slice(0,MAX_IMAGES).map(image => {
                    return (
                        <div className="flex h-16 w-16">
                            <ProfilePicture image={image}/>
                        </div>
                    )
                })}
                {imageCount > MAX_IMAGES 
                ?
                <span className="flex ml-2 items-center">+{imageCount - MAX_IMAGES} more</span>
                :
                <></>
                }
            </div>
        </>
    )
}