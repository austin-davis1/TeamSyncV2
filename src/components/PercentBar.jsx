

export function PercentBar({percent}) {
    return (
        <>
            <div className="flex rounded-lg w-full m-2 h-4 bg-off-white">
                <div className="flex rounded-lg bg-blue" style={{width: percent + "%"}}>
                </div>
            </div>
        </>
    )
}