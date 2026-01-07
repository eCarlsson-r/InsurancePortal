import React from "react";
import { Pie } from "react-chartjs-2";

const data = {
  datasets: [{
    data: [45, 25, 20, 10],
    borderWidth: 0,
    backgroundColor: [
      "rgba(89, 59, 219, .9)",
      "rgba(89, 59, 219, .7)",
      "rgba(89, 59, 219, .5)",
      "rgba(89, 59, 219, .07)"
    ],
    hoverBackgroundColor: [
      "rgba(89, 59, 219, .9)",
      "rgba(89, 59, 219, .7)",
      "rgba(89, 59, 219, .5)",
      "rgba(89, 59, 219, .07)"
    ]
  }],
  labels: [
    "one",
    "two",
    "three",
    "four"
  ]
};

const options = {
  responsive: true,
  legend: {
      display: false
  },
  maintainAspectRatio: false
}

const ChartPie = () => {
  return (
    <div style={{ height: '330px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default ChartPie;
