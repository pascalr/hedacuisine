json.extract! meal, :id, :recipe_id, :start_time, :end_time, :created_at, :updated_at
json.url meal_url(meal, format: :json)
