class CreateMachineUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :machine_users do |t|
      t.references :machine, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :nickname

      t.timestamps
    end
  end
end
