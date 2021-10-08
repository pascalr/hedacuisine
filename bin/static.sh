#!/bin/bash
#python3 -m http.server --directory "tmp/localhost:3000"
python3 bin/server_static.py 8000 --directory "tmp/localhost:3000"
