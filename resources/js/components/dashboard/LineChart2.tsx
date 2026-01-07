import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        label: "My First dataset",
        data: [28, 35, 36, 48, 46, 42, 60],
        backgroundColor: "rgba(115,86,241,0.12)",
        borderColor: "#7356f1",
        borderWidth: 3,
        pointBackgroundColor: "#7356f1",
        pointBorderColor: "#fff",
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7
    }]
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
        enabled: false,
    },
    legend: {
        display: false,
    },
    scales: {
        xAxes: [{
            display: false,
        }],
        yAxes: [{
            display: false,
        }]
    },
    title: {
        display: false,
    }
}

const LineChart2 = () => {
    return (
        <div style={{ height: '150px' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart2;
