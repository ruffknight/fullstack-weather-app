
# FrontEnd for Weather App

This is the React frontend interface of the weather application that fetches historical weather data using the Open-Meteo API. The app allows users to input a location and date range, and it will return daily weather information, including maximum and minimum temperatures and precipitation. The data is displayed in both a chart and a table.

For the full README check the file on the parent directory.

## Frontend Setup

#### Install Dependencies

```bash
npm install
```

#### Run the React App

To start the frontend app, run:

```bash
npm start
```

The React app will be available at `http://localhost:3001`.

## Usage

Once both the backend and frontend are running, navigate to the frontend interface in your browser and follow these steps:

1. Enter the location (e.g., "Lisbon") in the input field.
2. Select the start and end dates using the date pickers.
3. Click the "Get Data" button to fetch the weather data.
4. View the historical weather information displayed as a chart and table.

## Frontend
- Allows users to input location and date range to retrieve data.
- Displays data using a chart and table.
- Includes validation for empty inputs and date ranges.