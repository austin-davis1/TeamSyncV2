import Chart from "react-apexcharts"
import { useState, useEffect } from "react"

export function BarGraph({labels, data, title, colors}) {
    const [options, setOptions] = useState()
    const [series, setSeries] = useState()
    const [showChart, setShowChart] = useState(false);

    console.log(`DATA IN ${title} GRAPH`)
    console.log(data)

    useEffect(() => {
        let option = {}
        option.chart = {id: "basic-bar"}
        option.xaxis = {categories: labels}
        if (colors) {
            option.fill = {}
            option.fill.colors = colors
        }
        setOptions(option)

        let serie = [{}]
        serie[0].name = "series-1"
        serie[0].data = data
        setSeries(serie)
    }, [])

    useEffect(() => {
        setShowChart(true);
    },[series, options])

    return (
        <>
        {showChart 
            ?
            <>
                <h1 className="text-3xl font-bold m-2">{title}</h1>
                <Chart options={options} series={series} type="bar" width="500"/>
            </>
            :
            <span>Loading</span>
        }
        </>
    )
}