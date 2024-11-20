
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController,
  LineController,
} from 'chart.js';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  LineController
);

const App = () => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);

  const handleSubmit = async () => {
    if (!location || !startDate || !endDate) {
      setError('Please fill in all fields.');
      return;
    }

    if (startDate > endDate) {
      setError('Please ensure that start date is before end date.');
      return;
    }

    try {
      const encodedLocation = encodeURIComponent(location);
      const res = await axios.get('http://localhost:3000/weather', {
        params: {
          location: encodedLocation,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setWeatherData(res.data);
      setError(null);
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      setError('Failed to fetch weather data.');
      setWeatherData(null);
    }
  };

  const getChartData = () => {
    if (!weatherData) return {};

    const dates = weatherData.map((record) => record.date);
    const maxTemperatures = weatherData.map((record) => record.max_temperature);
    const minTemperatures = weatherData.map((record) => record.min_temperature);
    const precipitation = weatherData.map((record) => record.precipitation);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Max Temperature (°C)',
          data: maxTemperatures,
          borderColor: 'rgba(56, 142, 60, 1)',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Min Temperature (°C)',
          data: minTemperatures,
          borderColor: 'rgba(76, 175, 80, 1)',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Precipitation (mm)',
          data: precipitation,
          backgroundColor: 'rgba(120, 168, 230, 0.2)',
          fill: false,
          type: 'bar',
        },
      ],
    };
  };

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
    if (weatherData) {
      setChartInstance(new ChartJS('weatherChart', {
        type: 'line',
        data: getChartData(),
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            x: {
              type: 'category',
              labels: weatherData.map((record) => record.date),
            },
            y: {
              id: 'left',
              beginAtZero: true,
              position: 'left',
              title: {
                display: true,
                text: 'Temperature (°C)',
              },
            },
            y2: {
              id: 'right',
              beginAtZero: true,
              position: 'right',
              title: {
                display: true,
                text: 'Precipitation (mm)',
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        },
      }));
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [weatherData]);

  const renderTable = () => {
    if (!weatherData) return null;
    return (
      <table className="weather-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Max Temp (°C)</th>
            <th>Min Temp (°C)</th>
            <th>Precipitation (mm)</th>
          </tr>
        </thead>
        <tbody>
          {weatherData.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.max_temperature}</td>
              <td>{record.min_temperature}</td>
              <td>{record.precipitation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="app-container">
      <h1>Historical Weather Data</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input-field"
        />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="date-picker"
        />
        <span className="date-arrow">→</span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          className="date-picker"
        />
        <button onClick={handleSubmit} className="fetch-button">Get Data</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {weatherData && (
        <div className="weather-data-container">
          <h2>{weatherData[0].location}</h2>
          <canvas id="weatherChart" />
          {renderTable()}
        </div>
      )}
    </div>
  );
};

export default App;
