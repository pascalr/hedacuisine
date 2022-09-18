class AddFrequencyToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :frequency, :integer
  end
end
