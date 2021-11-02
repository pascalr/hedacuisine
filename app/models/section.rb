class Section < ApplicationRecord
  belongs_to :article

  acts_as_list scope: :article
end
