# HedaCuisine

Un repository qui contient le code pour faire fonctionner le site internet dynamique de hedacuisine.com.

## Utilisation

Pour se connecter à Heroku sans le browser.
$ heroku login -i

## Installation

bin/update_env_variables

Prendre les valeurs de heroku et les mettre pour figaro.

# Installer sequel pour pouvoir copier la database de postgresql to sqlite3.
$ sudo apt install ruby-sequel
$ gem install sequel

# Installer node.js
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
$ source ~/.bashrc
$ nvm install 16.14

https://www.backblaze.com/b2/docs/quick_command_line.html # Télécharger le command line et le mettre dans le ~/Downloads/b2-linux

# Installer foreman pour pouvoir utiliser bin/dev
sudo apt install ruby-foreman

### Installation troobleshooting

#### Too many symbolic links encountered on chromebook
error An unexpected error occure: "ELOOP": too many symbolic links encountered, chmod '/path/to/file'

Solution: Move the folder out of the Downloads directory.
