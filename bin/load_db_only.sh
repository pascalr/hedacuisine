#!/bin/bash
#pg_restore -d hedacuisine_development latest.dump

if [ "$#" -ne 1 ]; then
    echo "Load expects a file to be loaded."
    exit
fi

export LOAD_FILE=$1

rails database:load_dev $1
rails database:load_local $1
