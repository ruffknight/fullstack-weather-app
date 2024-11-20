class AddWeatherFieldsToWeatherRecords < ActiveRecord::Migration[8.0]
  def change
    add_column :weather_records, :max_temperature, :float
    add_column :weather_records, :min_temperature, :float
  end
end
