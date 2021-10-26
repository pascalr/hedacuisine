# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
#Language.create(name: 'Français (Canada)', locale: 'fr-CA')
#Language.create(name: 'English (Canada)', locale: 'en-CA')
fr = Language.find_or_create_by(name: 'Français')
fr.update(locale: 'fr')
en = Language.find_or_create_by(name: 'English')
en.update(locale: 'en')

Region.create(name: 'Québec', code: 'qc', locale: 'fr-CA', language: fr)
Region.create(name: 'Canada', code: 'ca', locale: 'en-CA', language: en)
Region.create(name: 'France', code: 'fr', locale: 'fr-FR', language: fr)
Region.create(name: 'United-States', code: 'us', locale: 'en-US', language: en)
