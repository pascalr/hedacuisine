OUT_DIR = "tmp/localhost:3001"

def add_download(path)
  puts "Adding path to download: #{path}"
  $download_list ||= []
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

  desc "TODO"
  task build: :environment do

    include Rails.application.routes.url_helpers

    FileUtils.rm_rf(OUT_DIR)

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
      #add_download(articles_path(locale: locale))
    end
    execute_download

    locales.each do |locale|

      Food.all.each do |food|
        next if food.recipes.blank?
        add_download(food_path(food, locale: locale))
      end

      Recipe.all_public.each do |recipe|
        add_download(recipe_path(recipe, locale: locale))
      end
      
      Kind.all.each do |kind|
        add_download(kind_path(kind, locale: locale))
      end

      #Article.all.each do |article|
      #  add_download(article_path(article, locale: locale))
      #end

    end
    execute_download

  end

  desc "Sync the s3 bucket with the sync directory"
  task sync_s3: :environment do

    s3_bucket = "heda-bucket-production"
    access_key_id = Rails.application.credentials.dig(:aws, :access_key_id)
    secret_access_key = Rails.application.credentials.dig(:aws, :secret_access_key)

    sync_folder = get_sync_folder
    sync_folder.mkpath

    system("AWS_ACCESS_KEY_ID=#{access_key_id} AWS_SECRET_ACCESS_KEY=#{secret_access_key} aws s3 sync s3://#{s3_bucket} #{sync_folder}")
  end
  
  desc "Move the files from the sync directory into the storage directory in the proper format"
  task s3_to_local: :environment do

    # OPTIMIZE: Be smart and not erase everything everytime...

    storage_folder = Rails.root.join('storage')
    FileUtils.rm_rf(storage_folder.to_s + '/*')

    Image.all.each do |im|
      path = "#{Rails.root}/sync/#{im.original.key}"
      if File.exist?(path)
        im.original.attach(io: File.open(path), filename: im.original.filename)
      else
        puts "File missing: #{im.original.key}"
      end
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
