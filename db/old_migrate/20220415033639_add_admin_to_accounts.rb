class AddAdminToAccounts < ActiveRecord::Migration[7.0]
  def change
    add_column :accounts, :admin, :boolean
  end
end
