export function ProfilePicture({image}) {
    return (
        <>
            <div className="flex h-full w-full rounded-full bg-white border-solid border-2 border-black">
                    <img src={image} className="flex object-fill rounded-full"/> 
            </div>
        </>
    )
}