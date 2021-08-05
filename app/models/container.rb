class Container < ApplicationRecord
  belongs_to :container_format
  belongs_to :machine
end
