class RemoveTemperatureFromWeatherRecords < ActiveRecord::Migration[8.0]
  def change
    remove_column :weather_records, :temperature, :float
  end
end
