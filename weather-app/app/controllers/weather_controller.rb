require 'httparty'

class WeatherController < ApplicationController
  COORDINATES_URL = "https://nominatim.openstreetmap.org/search"

  def index
    location = params[:location]
    start_date = params[:start_date]
    end_date = params[:end_date]

    # validates and converts parameters
    if location.blank? || start_date.blank? || end_date.blank?
      render json: { error: "Location, start_date, and end_date are required" }, status: :unprocessable_entity
      return
    end

    begin
      start_date = Date.parse(start_date)
      end_date = Date.parse(end_date)
    rescue ArgumentError
      render json: { error: "Invalid date format. Use YYYY-MM-DD." }, status: :unprocessable_entity
      return
    end

    # gets location coordinates and resolves location name
    latitude, longitude, resolved_location = get_coordinates(location)
    return render json: { error: "Unable to get location coordinates" }, status: :unprocessable_entity if latitude.nil? || longitude.nil?

    # checks database for missing records
    missing_dates = WeatherRecord.missing_records(resolved_location, start_date..end_date)

    if missing_dates.empty?
      # when all data is available in the database
      records = WeatherRecord.by_location(resolved_location).by_date_range(start_date, end_date)
      render json: records
    else
      # fetches data using WeatherService when there's missing data in db
      weather_service = WeatherService.new(latitude, longitude, start_date, end_date)
      fetched_data = weather_service.fetch_weather

      if fetched_data[:error].nil? && fetched_data[:daily].present?
        # stores the fetched data in the database
        fetched_data[:daily][:time].each_with_index do |date_str, index|
          parsed_date = Date.parse(date_str)

          # creates the record, if the record is not yet in the database
          if missing_dates.include?(parsed_date)
            WeatherRecord.create!(
              location: resolved_location, # Use the resolved location
              date: parsed_date,
              max_temperature: fetched_data[:daily][:temperature_2m_max][index],
              min_temperature: fetched_data[:daily][:temperature_2m_min][index],
              precipitation: fetched_data[:daily][:precipitation_sum][index]
            )
          end
        end

        # retrieves all data for the requested range from the database
        records = WeatherRecord.by_location(resolved_location).by_date_range(start_date, end_date)
        render json: records
      else
        render json: { error: "Failed to fetch weather data" }, status: :unprocessable_entity
      end
    end
  end

  private

  def get_coordinates(location)
    response = HTTParty.get(COORDINATES_URL, query: {
      q: location,
      format: "json",
      limit: 1
    }, headers: { "User-Agent" => "WeatherApp" })

    data = JSON.parse(response.body)
    if data.any?
      coordinates = data.first
      resolved_location = coordinates["display_name"]
      [coordinates["lat"].to_f, coordinates["lon"].to_f, resolved_location]
    else
      [nil, nil, nil]
    end
  rescue StandardError => e
    [nil, nil, nil]
  end
end
