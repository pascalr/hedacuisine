#!/bin/bash

rake website:build

# J'abandonne, les liens ne fonctionne pas avec les points d'interrogations... Ils sont encodés sur les liens en lignes, mais pas sur les fichiers locaux...
#wget -e robots=off -r -l 1 -k --restrict-file-names=nocontrol -P tmp "http://localhost:3000/sitemap"
#wget -e robots=off -mnH -P tmp "http://localhost:3000/sitemap"
#wget -e robots=off -r -l 1 -k --restrict-file-names=ascii -P tmp "http://localhost:3000/sitemap"
#wget -P tmp --mirror --convert-links --adjust-extension --page-requisites --no-parent "http://localhost:3000/"
#wget -e robots=off -r -l 1 -k -P tmp "http://localhost:3000/sitemap"
#wget -p -k -P tmp/static "http://localhost:3000/sitemap"
#-r -l 2
