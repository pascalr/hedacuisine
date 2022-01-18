#!/bin/bash
#pg_restore -d hedacuisine_development latest.dump

if [ "$#" -ne 1 ]; then
    echo "Load expects a file to be loaded."
    exit
fi

export LOAD_FILE=$1

rails database:load_dev $1
rails database:load_local $1

rails website:sync_from_b2_to_local
rails website:convert_sync_to_local
RAILS_ENV=local rails website:convert_sync_to_local
