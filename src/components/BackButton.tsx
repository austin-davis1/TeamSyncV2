import { useNavigate } from "react-router-dom"

export function BackButton() {
    const navigate = useNavigate()

    function goBack() {
        navigate(-1)
    }

    return (
        <>
            <button onClick={goBack} className="flex justify-center items-center bg-white mt-5 w-32 h-12 hover:border-4 rounded-lg hover:border-black hover:bg-blue hover:text-white">Back</button>
        </>
    )
}