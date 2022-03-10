#!/usr/bin/env ruby

require 'yaml'

raw = `heroku config`
raw = raw.split("\n")[1..-1].join("\n") # skip first line 
vars = YAML.load(raw)

keys = ['BACKBLAZE_BUCKET_NAME', 'BACKBLAZE_BUCKET_ID', 'BACKBLAZE_KEY_ID', 'BACKBLAZE_KEY_TOKEN']

env_vars = keys.inject({}) {|result, key|
  result[key] = vars[key]
  result
}

File.open("config/application.yml", "w") do |f|
  f.write(env_vars.to_yaml)
end

