class AddInstructionsToLinks < ActiveRecord::Migration[6.0]
  def change
    add_column :links, :instructions, :text
  end
end
