class AddKindIdToKinds < ActiveRecord::Migration[6.1]
  def change
    add_column :kinds, :kind_id, :integer
  end
end
