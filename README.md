Je veux pouvoir voir le contenu sur une application, et sur le web.
Je veux pouvoir modifier le contenu sur le web.
Dans le fond, je veux un client qui se connecte à la base de donnée, et je veux un serveur qui gère la base de données.
Mon client est en js. Je cherche un remplacement pour le serveur qui est plus lightweight que Ruby on Rails.
SQLite3 with Node.js?
Je peux déjà avoir un serveur PostgresSQL sur Fly.io, alors simplement utilisé ça...
Ça n'a pas l'air d'être possible. Probablement par sécurité.
Donc, faire une app Node.js minimaliste. Elle contient un système de authentification et une query get_data(user: ...) qui te retourne toute l'info. Un peu
comme je fais présentemment anyway. Database en SQLITE3. Dans la query, je vais faire plein de select all, mettre ça dans un objet et tout retourner.

# HedaCuisine

Un repository qui contient le code pour faire fonctionner le site internet dynamique de hedacuisine.com.

## Utilisation

Pour se connecter à Heroku sans le browser.
$ heroku login -i

## Installation

bin/update_env_variables

Prendre les valeurs de heroku et les mettre pour figaro.

### Installer sequel pour pouvoir copier la database de postgresql to sqlite3.
$ sudo apt install ruby-sequel
$ gem install sequel

# TODO: Essayer d'utiliser ASDF au lieu du rbenv et de nvm

### Installer node.js
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
$ source ~/.bashrc
$ nvm install 16.14

https://www.backblaze.com/b2/docs/quick_command_line.html # Télécharger le command line et le mettre dans le ~/Downloads/b2-linux

### Installer foreman pour pouvoir utiliser bin/dev
sudo apt install ruby-foreman

### Install ImageMagick
sudo apt install imagemagick

### Autre

cd ..
git clone https://github.com/pascalr/static-heda.git

### Installation troobleshooting

#### Too many symbolic links encountered on chromebook
error An unexpected error occure: "ELOOP": too many symbolic links encountered, chmod '/path/to/file'

Solution: Move the folder out of the Downloads directory.

vimrc

filetype plugin indent on
" On pressing tab, insert 2 spaces
set expandtab
" show existing tab with 2 spaces width
set tabstop=2
set softtabstop=2
" when indenting with '>', use 2 spaces width
set shiftwidth=2

call plug#begin('~/.vim/plugged')
Plug 'yuezk/vim-js'
Plug 'maxmellon/vim-jsx-pretty'
call plug#end()


