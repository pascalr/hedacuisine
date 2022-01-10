json.partial! 'themes/theme', theme: @theme

json.user do
  json.name current_user.name
end
