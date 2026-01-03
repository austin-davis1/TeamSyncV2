

export function TagButton({tag}) {

    let color

    if (tag === "Urgent") {
        color = "red"
    } else if (tag === "Priority") {
        color = "blue"
    } else if (tag === "Bug") {
        color = "blue"
    } else if (tag === "Upgrade") {
        color = "green"
    } else if (tag === "Question") {
        color = "green"
    } else if (tag === "Help Needed") {
        color = "blue"
    } else {
        color = "off-white"
    }

    return (
        <span className={`mr-4 p-2 text-white rounded-lg bg-${color}`}>{tag}</span>
    )
}