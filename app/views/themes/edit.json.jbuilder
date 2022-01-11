json.partial! 'themes/theme', theme: @theme

json.book_formats BookFormat.all.order(:name) do |book_format|
  json.id book_format.id
  json.name book_format.name
end

json.user do
  json.name current_user.name
end
