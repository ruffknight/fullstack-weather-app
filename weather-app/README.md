
# Backend for Weather App

This is the Ruby on Rails backend of the weather application that fetches historical weather data using the Open-Meteo API. The app allows users to input a location and date range, and it will return daily weather information, including maximum and minimum temperatures and precipitation. The data is displayed in both a chart and a table.

The backend will either return the data from the database (if already accessed) or fetch it from the Open-Meteo API, minimizing API requests.

For the full README check the file on the parent directory.

## Technologies Used

- **Backend:** Ruby on Rails
- **Database:** SQLite
- **Charting Library:** Chart.js
- **Weather API:** Open-Meteo API
- **Coordinates API:** Nominatim by OpenStreetMap

## Backend Setup

#### Install Ruby Dependencies

```bash
bundle install
```

#### Setup Database

Make sure to set up the database by running the following command:

```bash
rails db:migrate
```

#### Run the Rails Server

To start the backend server, run:

```bash
rails server
```

The server will be available at `http://localhost:3000`.

## Usage

Once both the backend and frontend are running, navigate to the frontend interface in your browser and follow these steps:

1. Enter the location (e.g., "Lisbon") in the input field.
2. Select the start and end dates using the date pickers.
3. Click the "Get Data" button to fetch the weather data.
4. View the historical weather information displayed as a chart and table.

## Backend
- Includes WeatherController that implements API endpoint that gets weather data with parameters (`location`, `start_date`, `end_date`). This controller fetches data from the database and in case of missing data calls WeatherService, then storing the fetched data in the database for caching and performance optimization, minimizing Open-Meteo API requests.
- Includes WeatherService that integrates the Open-Meteo API through HTTP requests.
- Defines WeatherRecord dtaa model for storing the historical weather information in the database. 
- Includes methods for handling coordinate conversion for a given location.
- Validates user inputs and handles errors.

## API Details

```bash
GET /weather?location=<location>&start_date=<start_date>&end_date=<end_date>
```

- **Endpoint:** `GET /weather`
- **Parameters:**
  - `location`: The location for which you want to retrieve the weather data. A closest match will be obtained (to ensure that inputs such as 'Porto', 'oporto' or 'PORTO' are able to be accesed and are not stored as separate records)
  - `start_date`: The start date for the weather data range (format: `YYYY-MM-DD`).
  - `end_date`: The end date for the weather data range (format: `YYYY-MM-DD`).
- **Example Request:**
  ```bash
  curl "http://localhost:3000/weather?location=Lisbon&start_date=2024-11-10&end_date=2024-11-20"
  ```
