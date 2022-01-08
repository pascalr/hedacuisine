OUT_DIR = "tmp/localhost:3001"
  
$download_list ||= []

def add_download(path)
  puts "Adding path to download: #{path}"
  $download_list << "http://localhost:3001#{path}"
end

def execute_download
  puts "Executing the download for the download list"
  File.open("tmp/download-list", 'w') { |file| file.write($download_list.join("\n")) }
  system("wget -e robots=off -p -P tmp -i tmp/download-list")
  #system("wget -q -e robots=off -p -P tmp -i tmp/download-list")
  move_files_without_extensions
  $download_list.clear
end

def get_sync_folder
  Rails.root.join('sync')
  #sync_folder.mkpath
end

def move_files_without_extensions

  puts "Moving the files to directories and index.html"

  Dir.glob("#{OUT_DIR}/**/*") do |path|
    next if path.starts_with?("#{OUT_DIR}/images")
    next if path == '.' or path == '..'
    next unless File.extname(path).blank?
    next if File.directory?(path)
    tmp_dir_path = path+"-tmp"
    Dir.mkdir(tmp_dir_path)
    File.rename path, tmp_dir_path+"/index.html"
    File.rename tmp_dir_path, path
  end
end

namespace :website do

  task publish_modifications: :environment do
    Recipe.all_public.where(mods_unpublished: true).each do |recipe|
    end
  end
  
  desc "TODO"
  task check: :environment do

    Recipe.all_public.each do |recipe|
      ws = recipe.warnings
      (ws || []).each do |warning|
        puts "WARNING (recipe=#{recipe.name}): #{warning}"
      end
    end
  end
  
  task clear: :environment do
    FileUtils.rm_rf(OUT_DIR)
  end

  task build_image_thumbnails: :environment do

    require "#{Rails.root}/app/helpers/application_helper"
    include ApplicationHelper

    Recipe.all_main.all_public.with_images.map(&:image).each do |image|
      add_download(thumb_image_path(image))
    end
    execute_download
  end

  desc "TODO"
  task build: [:environment, :clear, :build_image_thumbnails] do

    #Rake::Task["website:build_image_thumbnails"].invoke

    include Rails.application.routes.url_helpers

    locales = ["fr-CA"]
    #locales = ["fr", "en"]
      
    add_download("/")
    execute_download

    locales.each do |locale|
      add_download(home_path(locale: locale))
    end
    execute_download

    locales.each do |locale|
      add_download(recipes_path(locale: locale))
      add_download(recipe_kinds_path(locale: locale))
      add_download(recipes_path(locale: locale, format: :json))
      #add_download(articles_path(locale: locale))
    end
    execute_download

    locales.each do |locale|

      Food.all_public.each do |food|
        next if food.recipes.blank?
        add_download(food_path(food, locale: locale))
      end

      Recipe.all_public.each do |recipe|
        add_download(recipe_path(recipe, locale: locale))
      end
      
      Kind.all.each do |kind|
        add_download(kind_path(kind, locale: locale))
      end
      
      RecipeKind.all.each do |recipe_kind|
        add_download(recipe_kind_path(recipe_kind, locale: locale))
      end

      #Article.all.each do |article|
      #  add_download(article_path(article, locale: locale))
      #end

    end
    execute_download

  end

  task sync_from_local_to_b2: :environment do
    bucket_name = ENV['BACKBLAZE_BUCKET_NAME']
    #bucket_id = ENV['BACKBLAZE_BUCKET_ID']
    key_id = ENV['BACKBLAZE_KEY_ID']
    key_token = ENV['BACKBLAZE_KEY_TOKEN']

    system("B2_APPLICATION_KEY_ID=#{key_id} B2_APPLICATION_KEY=#{key_token} ~/Downloads/b2-linux sync #{get_sync_folder} b2://#{bucket_name}/")
  end
  
  task sync_from_b2_to_local: :environment do
    bucket_name = ENV['BACKBLAZE_BUCKET_NAME']
    #bucket_id = ENV['BACKBLAZE_BUCKET_ID']
    key_id = ENV['BACKBLAZE_KEY_ID']
    key_token = ENV['BACKBLAZE_KEY_TOKEN']

    system("B2_APPLICATION_KEY_ID=#{key_id} B2_APPLICATION_KEY=#{key_token} ~/Downloads/b2-linux sync b2://#{bucket_name}/ #{get_sync_folder}")
  end

  task fix_s3: :environment do

    s3_bucket = "heda-bucket-production"
    access_key_id = Rails.application.credentials.dig(:aws, :access_key_id)
    secret_access_key = Rails.application.credentials.dig(:aws, :secret_access_key)

    system("AWS_ACCESS_KEY_ID=#{access_key_id} AWS_SECRET_ACCESS_KEY=#{secret_access_key} aws s3 sync #{get_sync_folder} s3://#{s3_bucket}")
  end

  desc "Sync the s3 bucket with the sync directory"
  task sync_s3: :environment do

    s3_bucket = "heda-bucket-production"
    access_key_id = Rails.application.credentials.dig(:aws, :access_key_id)
    secret_access_key = Rails.application.credentials.dig(:aws, :secret_access_key)

    system("AWS_ACCESS_KEY_ID=#{access_key_id} AWS_SECRET_ACCESS_KEY=#{secret_access_key} aws s3 sync s3://#{s3_bucket} #{get_sync_folder}")
  end
  
  desc "Move the files from the sync directory into the storage directory in the proper format"
  task convert_sync_to_local: :environment do

    # OPTIMIZE: Be smart and not erase everything everytime...

    storage_folder = Rails.root.join('storage')
    FileUtils.rm_rf(storage_folder.to_s + '/*')

    image_data = {}
    Image.order(id: :desc).all.each do |im|
      image_data[im.id] = {key: im.original.key, filename: im.original.filename}
    end
    ActiveRecord::Base.connection.execute("DELETE FROM active_storage_variant_records;")
    ActiveRecord::Base.connection.execute("DELETE FROM active_storage_attachments;")
    ActiveRecord::Base.connection.execute("DELETE FROM active_storage_blobs;")
    Image.all.each do |i|
      data = image_data[i.id]
      path = get_sync_folder.join(data[:key])
      #if File.exist?(path)
      ####  im.original.attach(io: File.open(path), filename: im.original.filename)
      #else
      #  puts "File missing: Image(id: #{im.id}, key: #{im.original.key})"
      #end
      i.original.attach(io: File.open(path), filename: data[:filename])
    end
    
    #images.each do |path_name|

    #  dir, basename = path_name.split
    #  file_name = basename.to_s
    #  sub_folder = storage_folder.join(file_name[0..1], file_name[2..3])
    #  sub_folder.mkpath # Create the subfolder used by active_record
    #  #path_name.rename(dir + sub_folders + basename) # Renames file to be moved into subfolder
    #  FileUtils.cp(path_name, storage_folder.join(sub_folder))
    #end

  end

end
