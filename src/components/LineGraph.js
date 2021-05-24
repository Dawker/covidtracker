import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

// cases = "rgb(204, 16, 52)", recovered: rgb: "rgb(125, 215, 29)", deaths rgb: "rgb(251, 68, 67)",

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0, 0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            // Include a dollar sign in the ticks
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

const LineGraph = ({ casesType = "cases", lineColors, country, ...props }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    let isCancelled = true;
    if (isCancelled) {
      const fetchData = async () => {
        if (country === "Worldwide") {
          try {
            await fetch("https://disease.sh/v3/covid-19/historical/all")
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                var chartData = buildChartData(data, casesType);

                setData(chartData);
              });
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await fetch(`https://disease.sh/v3/covid-19/historical/${country}`)
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                var chartData = buildChartData(data.timeline, casesType);

                setData(chartData);
              });
          } catch (error) {
            console.log(error);
          }
        }
      };
      fetchData();
    }

    return () => (isCancelled = false);
  }, [casesType, country]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: lineColors,
                borderColor: lineColors,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
};

export default LineGraph;
