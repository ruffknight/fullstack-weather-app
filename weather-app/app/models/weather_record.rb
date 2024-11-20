class WeatherRecord < ApplicationRecord
    validates :location, presence: true
    validates :date, presence: true, uniqueness: { scope: :location } # guarantees unique date within given location
    validates :max_temperature, :min_temperature, :precipitation, numericality: true, allow_nil: true
  
    scope :by_location, ->(location) { where(location: location) }
    scope :by_date_range, ->(start_date, end_date) { where(date: start_date..end_date).order(:date) }

    # identifies the dates for which there are missing records
    def self.missing_records(location, requested_range)
        existing_dates = by_location(location).by_date_range(requested_range.first, requested_range.last).pluck(:date)
        requested_range.to_a - existing_dates
    end
  end
  