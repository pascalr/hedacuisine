json.extract! listing, :id, :name, :order, :created_at, :updated_at
json.url listing_url(listing, format: :json)
