
    

import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function StockPriceLineChart() {

    const priceData =[112,114,116,130,100,102]
    const dateData =['Mon','Tue','Wed','Thur','Fri','Sat']

    const chartRef = useRef(null);

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    const data = {
        labels: dateData,
        datasets: [
            {
                label: 'Stock Price',
                data: priceData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const date = dateData[tooltipItem.dataIndex];
                        const price = priceData[tooltipItem.dataIndex].toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        });
                        return `Date: ${date}, Price: $${price}`;
                    },
                },
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Price ($)',
                },
                beginAtZero: false,
            },
        },
    };

    return (
        <div className="line-chart-container">
            <Line ref={chartRef} data={data} options={options} />
        </div>
    );
}

export default StockPriceLineChart;

