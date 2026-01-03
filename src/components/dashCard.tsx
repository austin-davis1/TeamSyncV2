

export function DashCard({title, data, color}) {
    let bgColor = `bg-${color}`
    return (
        <>
            <div className = "transition-all flex flex-col duration-200 w-full h-full p-5 m-5 border-solid rounded-lg cursor-pointer group bg-white hover:bg-hover-gray">
                <div className = "h-full">
                    <div className={"flex justify-center h-12 w-full pl-2 rounded-lg " + bgColor}>
                        <h1 className = "text-3xl truncate font-bold">{title}</h1>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <span className="font-bold text-8xl">{data}</span>
                    </div>
                </div>
            </div>
        </>
    )
}