En payant, les utilisateurs peuvent rendre leur menus privés. Sinon leur menus sont publiques.

Toutes les images originales seront stockés à part de l'application dans un dossier /images qui ne sera pas trackés dans git

TODO: images rsync dans un backup.
Les images dans un modèle.
Image original:string
où original est l'emplacement relatif avec le nom du fichier dans le dossier des images original

les images vont se retrouver dans /public/images/1234,
où 1234 est le id de l'image

Dans meta, pouvoir créer une nouvelle image. 
Il te demande simplement le path de l'image.
Ensuite, tu choisis en cochant les versions que tu veux.
Ensuite la methode process_image est appeler.
Un dossier est ensuite créer dans /public/images/1234,
où 1234 est le id de l'image

Versions d'images:
- Thumbnails (pour afficher dans search 64X64 peut-être?)
- Small size (pour afficher dans une liste avec d'autres recettes)
- Medium size (pour afficher dans la recette principale)
Peut-être un jour big size, quand tu cliques ça ouvres une plus grande image.

Dans les recherches de recettes, 2 types.
-
Petite image de pizza à gauche
<b>Pizza</b>
30 recettes
-
Pizza peperonni fromage
Pizza hawaienne
17 autres résultats correspondant à la recherche
Avec une mini image à côté des recettes peut-être? Genre 64X64 pixels.

Comment gérer les ingrédients par contre?
Ne pas pouvoir recherche par ingrédient. Au pire l'ingrédient fait partie d'un menu. Par exemple, les fraises. 17 recettes avec des fraises.

Un article pour chauqe ingrédient ou non? Oui et au pire pas grand chose d'autres qu'une liste des recettes qui l'utilise. Ça pourrait être une liste avec des images pour les ingrédient, quand il n'y en a pas beaucoup...

Pour les menus aussi ça pourrait être avec des images. 2 images côte-à-côte, centré. Ou bien 3 images côte-à-côte, centré. Ou bien Juste une liste une après l'autre pourrait être très bien aussi.

Qu'est-ce que je veux vraiment garder?
- Images originales
- Bases de données Admin
- Bases de données HedaCuisine
- La dernière version de Admin/
- La dernière version de HedaCuisine/
- Un autre truc git à backup?
Backup à toutes les nuits sur un autre disque.
Backup de snapshots à toutes les semaines sur un autre disque.

# Programmer rsync toute les nuits pour pouvoir repartir du dernier backup s'il y a un problème
rsync -aP --delete src/ dest

# Programmer un snapshot avec rsync et garder en backup toutes les semaines on ne sait jamais...
rsync -aP src/ dest


Dans mon menu déroulant Recettes, peut-être rajouter des onglets
Nations | Ingrédients | Thèmes | ...


Ça serait bien un petit paragraphe d'introduction qui présente la recette. D'où que ça vient et un petit fait intéressant peut-être. Un peu comme ici: https://www.ricardocuisine.com/recettes/9131-pizza-aux-pommes-de-terre-et-au-romarin.



TODO: Pouvoir rajouter des sous-titres dans la préparation:
Voir par exemple cette recette qui est quand même longue.
https://www.ricardocuisine.com/recettes/5714-shortcake-aux-fraises-le-meilleur-
Peut-être avec un underscore au début.
_ Gâteau
_ Fraises à la vanille
_ Crème chantilly
_ Montage

_ Préparation
# Dans un bol, mélanger ensemble {1-3}
# Dans un autre bol, fouetter ensemble les oeufs avec le miel au batteur électrique environ 10 minutes. Le mélange devrait former un ruban. {4-5}
# À l'aide d'un fouet, incorporer les ingrédients secs.
# Faire fondre {6} et l'incorporer en mince filet.
# Réfriger le mélange 30 minutes
# Beurrer et fariner un moule à madeleine.
# Placer le moule à madeleine 30 minutes au congélateur pour éviter qu'elles ne collent à la farine.
# Remplir chaque moule aux trois quarts.
# Cuire au four préchauffé à 200C jusqu'à ce que les madeleines soient légèrement dorées (environ 6 minutes)
# Démouler et laisser refroidir complètement
# Répéter avec le reste de la pâte
_ Note

TODO: Pas nécessaire d'avoir des quantités pour tous les ingrédients. Par exemple. Relish, ketchup, dans un hamburger... sel, poivre...

TODO: Pas de nom ambigu. Par exemple, cannelle en bâton et cannelle moulue, pas simplement cannelle. Haricots rouges cuits, haricots rouges secs, pas seulement haricots rouges.

TODO: Validate Food. Plural exist for unitary foods. Density also.

Faire une vidéo sur les muffins. C'est quoi qui les différencies des autres choses. Faire une recette en brassant beaucoup et une autre simplement en incorporant pour humidifier.

FIXME: Menu index, Style Netflix?

TODO: Séparer la cuisson des instructions peut-être? Le temps de cuisson devrait être dans la database du moins probablement. Pas important pour l'instant. Dire de préchauffé le four à la première instruction ou non?

TODO: En cliquant sur un ingrédient, rajouter un popup. Dans le popup informatif, une image, des suggestions de remplacer l'ingrédient par et un bouton plus d'informations qui va vers l'article de l'ingrédient.

Dans l'edit de recette, afficher les traductions ou du moins un warning si jamais modifier la recette, ça demande si on modifie la traduction, on crée une nouvelle traduction, ou....

Once in a while, do a cleanup and remove all the translations that are not used anymore. (Either changed or a spelling mistake fixed.)

Les RecipeStep peuvent aussi être des notes. Rajouter un boolean pour des notes?

Add language to recipes. Everything else in french. (Food, units, menus, ...) Why only recipes? Because it is the only thing that users are able to create. Mais pour l'instant je veux rédiger les recettes en français de toute façon... Ok tout en français pour l'instant.

TODO: When there are mulitple times the same ingredient show a warning and show how much total ingredient is required.

TODO: Aliases

Pour recettes similaire, afficher le nom et les ingrédients d'une recette similaire et des flèches pour naviguer les recettes similaires.

TODO: Fuck i18n, utiliser seulement mon translation. Rajouter le model Sentence content:string, après faire translate_sentence("Similar recipes"), qui s'assure que le contenu sois dans les sentences.

TODO: In translated, check both ways. Original Fr->En AND Translated En->Fr

TODO: Remove group. Replace with SimilarRecipe
TODO: Un algorithme pour détecter les recettes simillaires selon le nom et les ingrédients.

TODO: Cache all translations. Only load at startup.

TODO: Cacher le menu de gauche pour le téléphone cellulaire.
TODO: Pour faire apparaître et disparaître le menu sur la gauche sur les cellulaires, c'est un bouton qui suit l'écran en bas, comme sur une vrai application, comme Daniel fait.

TODO: La page pour les thèmes (listings), faire une page comme pour netflix avec des images en carrousel pour chaque sous-catégories.

TODO: Des liens pour toutes les recettes.

Site de recettes de niche. Recettes écologiques. Les recettes ne sont pas nécessairement végétarienne ou végane. Ce sont toutefois des recettes écologique, où la viande n'est pas l'ingrédient principal. La viande peut se retrouver en petite quantité pour donner un peu de goût. Par exemple, un ragoût composé à 95% de légumes racines très écologique et d'un peu de saucisses est acceptable sur notre site internet et il est toujours possible de remplacer la viande par de la fausse viande. Si les recettes peuvent remplacer la viande par de la fausse viande, la recette peut être sur le site. Par contre, une recette de canard confit n'a pas sa place ici.

Tu veux pouvoir rechercher en français et en anglais. Les menus seraient dans ta langue principale?
Je fabule. Keep it simple. Stupid.

Le site est principalement pour moi et Céline présentement. L'objectif est de l'utiliser et de monter une petite banque de recettes.

 DDDDDDDDDDDEDEEEEEEEEEEEEEEPPPPPPPPPPPPRRRRRRRRREEEEEEEECCCCCCCCCAAAAAAAATTTTTTTTEEEEEEEDDDDDDDDDD
 DDDDDDDDDDDEDEEEEEEEEEEEEEEPPPPPPPPPPPPRRRRRRRRREEEEEEEECCCCCCCCCAAAAAAAATTTTTTTTEEEEEEEDDDDDDDDDD
 DDDDDDDDDDDEDEEEEEEEEEEEEEEPPPPPPPPPPPPRRRRRRRRREEEEEEEECCCCCCCCCAAAAAAAATTTTTTTTEEEEEEEDDDDDDDDDD

C'est bien de trouver des recettes et continuer de faire mes menus, peut-être une heure par jour. Ça me trouve des recettes et c'est génial, mais continuer mon robot pour qu'il me les fasse les recettes et que je les modifie. Par exemple, ne pas utilise de samba oelek, remplacer par chili broyé et autre.

TODO: Rajouter une validation Heda aux recettes et n'afficher que les recettes valides Heda.

Ne pas offrir d'enregistrer ses propres listes de recettes au début.

Ce site est un recueil de recettes et est composé principalement de lien vers d'autres sites internet.
Quelques recettes sont sur ce site, ce sont mes recettes.
Les ingrédients et l'essentielles des instructions sont possiblement pris sur les sites internet dans le but de pouvoir comparer les recettes, et dans le but d'un jour être cuisiner par notre robot de cuisine, Heda.

Faire une extension dans le navigateur pour gérer mes recettes serait génial.


Comment compiler le site internet pour qu'il soit statique?
copier la database de production à la database de development local
cacher tous les trucs dynamique (login, ...)
utiliser wget pour tout downloader recursivement dans un dossier

créer une application sur téléphone ou ordinateur pour gérer les recettes custom des utilisateurs

it's the users data
we offer backup for them, either free in exchange for their data being public or paid

Statique vs Dynamique:
Avantages statique:
- Ne coûte vraiment pas cher
Avantages dynamique:
- Permet d'avoir des utilisateurs en ligne
- Permet aux utilisateurs de créer du contenu

EST-CE QUE JE VEUX QUE LES UTILISATEURS PUISSENT CRÉER AJOUTER DES IMAGES À LEUR RECETTE UN JOUR?
Oui avec une application. Dans l'application, rajouter une photo, et là ça prend la photo.

Le site internet statique. L'application est nécessaire pour créer des recettes? Pas de ratings?

L'application peut communiquer avec notre serveur pour nous envoyer leurs recettes, et on fait un backup avec et on
peut les rendre publique et les partager avec leurs amis peut-être?

Options:
Publique: Public pour tout le monde
Privé: Partage avec seulement des amis à qui on envoie le lien
Privé serait une option payante peut-être.
