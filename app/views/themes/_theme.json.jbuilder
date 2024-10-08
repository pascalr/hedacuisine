json.theme do
  json.id theme.id
  json.name theme.name
  json.class_name "theme"
  json.url theme_path(theme)
  json.edit_url edit_theme_path(theme)
  json.background_color theme.background_color
  json.inverted_background_color theme.inverted_background_color
  json.inverted_text_color theme.inverted_text_color
  json.link_color theme.link_color
  json.text_color theme.text_color
  json.front_page_image_id theme.front_page_image_id
  if theme.book_format
    json.partial! 'book_formats/book_format', book_format: theme.book_format
  end
  if theme.front_page_image
    json.front_page_image do
      json.id theme.front_page_image_id
      json.filename theme.front_page_image.filename
      json.url @application_controller.original_image_path(theme.front_page_image)
    end
  end
  json.page_separator_color theme.page_separator_color
end
