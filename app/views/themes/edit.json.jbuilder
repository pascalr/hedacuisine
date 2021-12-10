json.theme do
  json.id @theme.id
  json.name @theme.name
  json.class_name "theme"
  json.url theme_path(@theme)
  json.background_color @theme.background_color
end
