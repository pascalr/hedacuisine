class UserSibling < ApplicationRecord
  belongs_to :user
  belongs_to :sibling, class_name: "User"
end
