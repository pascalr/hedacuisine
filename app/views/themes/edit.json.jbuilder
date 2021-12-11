json.theme do
  json.id @theme.id
  json.name @theme.name
  json.class_name "theme"
  json.url theme_path(@theme)
  json.background_color @theme.background_color
  json.text_color @theme.text_color
  json.page_separator_color @theme.page_separator_color
end
json.user do
  json.name current_user.name
end
