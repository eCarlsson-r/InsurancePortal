import React from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: "My First dataset",
            data: [65, 59, 80, 81, 56, 55, 80, 81, 56, 55, 40],
            borderColor: "rgba(115, 86, 241, 1)",
            borderWidth: 0,
            backgroundColor: "rgba(115, 86, 241, 1)"
        },
        {
            label: "My Second dataset",
            data: [28, 48, 40, 19, 86, 27, 40, 19, 86, 27, 90],
            borderColor: "rgba(88, 115, 254, 1)",
            borderWidth: 0,
            backgroundColor: "rgba(78, 50, 201, 1)"
        }
    ]
};

const options = {
    maintainAspectRatio: false,
    tooltips: {
        enabled: false,
    },
    legend: {
        display: false,
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            },
            gridLines: {
                display: false,
                drawBorder: false
            },
        }],
        xAxes: [{
            barPercentage: 0.8,
            gridLines: {
                display: false,
                drawBorder: false
            },
        }]
    }
}

const BarChart = () => {
    return (
        <div style={{ height: '290px' }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default BarChart;
