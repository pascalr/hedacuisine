def add_download(path)
  $download_list ||= []
  $download_list << "http://localhost:3000#{path}"
end

def execute_download
  File.open("tmp/download-list", 'w') { |file| file.write($download_list.join("\n")) }
  system("wget -e robots=off -p -P tmp -i tmp/download-list")
  move_files_without_extensions
  $download_list.clear
end

def move_files_without_extensions

  puts "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"

  Dir.glob('tmp/localhost:3000/**/*') do |path|
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

    FileUtils.rm_rf('tmp/localhost:3000/')

    locales = ["fr"]
    #locales = ["fr", "en"]
      
    add_download("/")
    execute_download

    locales.each do |locale|
      add_download("/#{locale}")
    end
    execute_download

    locales.each do |locale|
      add_download(recipes_path(locale: locale))
      add_download(articles_path(locale: locale))
    end
    execute_download

    locales.each do |locale|

      Recipe.all_public.each do |recipe|
        add_download(recipe_path(recipe, locale: locale))
      end

      Article.all.each do |article|
        add_download(article_path(article, locale: locale))
      end

    end
    execute_download

  end

end
