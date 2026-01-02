import { getAllTasks } from "../data/taskData.js"
import { useEffect, useState } from "react"
import { Loading } from "./LoadingIndicator"
import Chart from "react-apexcharts"
import { CollectionsBookmarkOutlined } from "@mui/icons-material"

export function UserSection({colors}) {
    const [userMap, setUserMap] = useState({})
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [barOptions, setBarOptions] = useState({})
    const [barSeries, setBarSeries] = useState([])
    const [showChart, setShowChart] = useState(false)

    useEffect(() => {
        async function calculateUserTasks() {
            let freqMap = {}
            let tasks = await getAllTasks()
            for (let task of tasks.filter((task) => task.status == 1)) {
                for (let i = 0; i < task.users.length; i++) {
                    if (task.users[i].username in freqMap) {
                        freqMap[task.users[i].username] += 1
                        setUserMap(freqMap)
                    } else {
                        freqMap[task.users[i].username] = 1
                        setUserMap(freqMap)
                    }
                }
            }
            
            let series = [{}]
            series[0].name = "Total Tasks"
            series[0].data = Object.values(freqMap)
            setBarSeries(series)

            let options = {}
            if (colors) {
                options.colors = colors
            }
            options.plotOptions = {bar: {horizontal: true}}
            options.xaxis = {categories: Object.keys(freqMap)}
            options.yaxis = {reversed: true}
            options.grid = {yaxis: {lines: {show: false}}}
            options.chart = {toolbar: {show: false}, height: 100}

            setBarOptions(options)

            setLoadingUsers(false)

        }
        calculateUserTasks()
    }, [])

    useEffect(() => {
        if (barOptions?.xaxis?.categories.length !== 0 && barSeries.length !== 0) {
            setShowChart(true)
        }
    }, [barOptions, barSeries])

    return (
        <>
        {loadingUsers 
            ?
            <Loading/>
            :
            <>
                <div className="flex flex-col w-auto m-4">
                    <h1 className="text-3xl font-bold m-2">Active Tasks Per User</h1>
                    {showChart 
                    ?
                    <Chart height="300" options={barOptions} series={barSeries} colors={colors} type="bar"/>
                    :
                    <></>
                    }
                </div>
            </>
        }
        </>
    )
}