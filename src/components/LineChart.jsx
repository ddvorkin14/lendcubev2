import React from "react";
import { ResponsiveLine } from '@nivo/line'

const LineChart = (props) => {
  const { data, id, indices, yAxis} = props;

  const len = Math.floor(data?.length / 5) * 5;
  let lastYTick = 0;

  let yAxises = data?.map((d) => {
    lastYTick = lastYTick + Math.round((yAxis / len) / 5) * 5;
    return lastYTick;
  })

  if(yAxises.length > 10){
    lastYTick = 0;
    yAxises = data?.map((d) => {
      lastYTick = lastYTick + Math.floor((yAxis / (len / 4)) / 10) * 10;
      return lastYTick;
    })
  }

  return (
    <ResponsiveLine
      data={ [{ id: id, data: data }] }
      margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', stacked: true, min: 0, max: yAxis }}
      yFormat=" >-.2f"
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickValues: indices,
        tickSize: 4,
        tickPadding: 5,
        tickRotation: indices?.length > 10 ? (indices.length > 15 ? 25 : 20) : 0,
        legend: 'Total Payments',
        legendOffset: indices?.length > 10 ? 42 : 35,
        legendPosition: 'middle'
      }}
      axisLeft={{
        tickValues: yAxises,
        tickSize: 5,
        tickPadding: 10,
        tickRotation: 0,
        format: '$.2s',
        legend: 'Amount',
        legendOffset: -55,
        legendPosition: 'middle'
      }}
      enableGridX={false}
      colors={{ scheme: 'spectral' }}
      lineWidth={1}
      pointSize={4}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={1}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      gridXValues={indices}
      gridYValues={yAxises}
    />
  )
}

export default LineChart;