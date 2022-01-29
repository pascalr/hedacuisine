json.set! @application_controller.local_assigns[:label] ? label : 'image'  do
  json.class_name "image"
  json.url image_path(image)
  json.path @application_controller.image_variant_path(image, :medium)
  json.is_user_author !!image.is_user_author
  json.url image_url(image)
end
