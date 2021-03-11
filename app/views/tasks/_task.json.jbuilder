json.extract! task, :id, :title, :description, :user_id, :estimated_hours, :created_at, :updated_at
json.url task_url(task, format: :json)
