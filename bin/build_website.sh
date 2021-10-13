#!/bin/bash

#echo "Copying git"
#cp "../static-heda/CNAME" "tmp/tmp-CNAME"
#rm -Rf "tmp/tmp-git/"
#cp -R "../static-heda/.git" "tmp/tmp-git"
#rm -Rf "../static-heda/"
rake website:build
rm -R "../static-heda/docs"
cp -R "tmp/localhost:3000" "../static-heda/docs"
printf %s "www.hedacuisine.com" >> "../static-heda/docs/CNAME"
#echo "www.hedacuisine.com" > "../static-heda/docs/CNAME"
#echo "Restoring git"
#cp "tmp/tmp-CNAME" "../static-heda/CNAME"
#cp -R "tmp/tmp-git" "../static-heda/.git"

# J'abandonne, les liens ne fonctionne pas avec les points d'interrogations... Ils sont encodés sur les liens en lignes, mais pas sur les fichiers locaux...
#wget -e robots=off -r -l 1 -k --restrict-file-names=nocontrol -P tmp "http://localhost:3000/sitemap"
#wget -e robots=off -mnH -P tmp "http://localhost:3000/sitemap"
#wget -e robots=off -r -l 1 -k --restrict-file-names=ascii -P tmp "http://localhost:3000/sitemap"
#wget -P tmp --mirror --convert-links --adjust-extension --page-requisites --no-parent "http://localhost:3000/"
#wget -e robots=off -r -l 1 -k -P tmp "http://localhost:3000/sitemap"
#wget -p -k -P tmp/static "http://localhost:3000/sitemap"
#-r -l 2
