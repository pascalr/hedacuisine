class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def owned_by?(user)
    return false unless user
    self.user_id == user.id
  end
end
