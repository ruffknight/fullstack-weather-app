require 'httparty'

class WeatherService
    FORECAST_URL = "https://historical-forecast-api.open-meteo.com/v1/forecast"
  
    def initialize(latitude, longitude, start_date, end_date)
      @latitude = latitude
      @longitude = longitude
      @start_date = start_date
      @end_date = end_date
    end
  
    def fetch_weather
        response = HTTParty.get(FORECAST_URL, query: {
          latitude: @latitude,
          longitude: @longitude,
          start_date: @start_date,
          end_date: @end_date,
          daily: "temperature_2m_max,temperature_2m_min,precipitation_sum"
        }, timeout: 10)
      
        if response.code == 200
          JSON.parse(response.body).deep_symbolize_keys
        else
          { error: "Failed to fetch data: HTTP #{response.code}" }
        end
      rescue JSON::ParserError => e
        { error: "Invalid JSON response: #{e.message}" }
      rescue StandardError => e
        { error: "An error occurred: #{e.message}" }
      end
      
  end
 