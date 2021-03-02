https://aqueous-fortress-30634.herokuapp.com/
http://www.responsinator.com/?url=hedacuisine.com

TODO: Process recipes like before. Add units. Add ingredients. They are heda, users can't add
any. At least for now. I want to try to add all ingredients anyway. But I will have to do something about ingredients anyway. Aliases probably. (Lait végétal => Lait d'avoine) This is how you decide your preferences. (Huile végétal => Huile de canola, Huile de tournesol, ...) Units and ingredients belong to a language. Complete the french language first. Maybe link between languages when it makes sense between ingredients, when it is translable.

TODO: An item has a link, or has a recipe
FIXME: It should be item rating. Not recipe_rating. Ratings applies to recipes and to links.

Ça serait cool de pouvoir programmer les recettes visuellement. Tu prends des ingrédients en input. Tomates, céleris, etc. Tu prends un pot en input. Tu les drags and drop sur la step 1. Tu drag and drop les ingrédients dans le pots pour qu'il les rajoute dans le pots. Ensuite tu drag and drop le pot dans le step 2. Tu drag and drog l'outil pour mélanger. Tu mets l'outils pour mélanger dans le pot. Je viens juste de penser à ça et je trouve ça cool, mais on s'entend que ce n'est vraiment pas une priorité!

Écrire un texte avec des commandes c'est ça le plus rapide et le plus simple une fois que tu es habitué.

TODO: Get all the recipes from here: https://www.culinarynutrition.com/stocking-a-culinary-nutrition-pantry/
https://www.culinarynutrition.com/packaged-staple-foods-you-can-easily-make-from-scratch/
https://lovingitvegan.com/category/entree/page/2/ # Some great vegan recipes!

FIXME: By putting the database inside git, someone could know my password maybe. It's encrypted but is it secure?

Tout ce que je fais sur le site présentement est juste personnel et pouvoir montrer aux investisseurs. Parce que par exemple, les liens des recettes que je trouve sont souvent en anglais dans mes menus français. Je ne veux pas focuser sur faire un site de recette. Je veux focuser sur mon robot. Là je fais juste trouver des recettes et montrer ce que ça va avoir l'air. (et faire de quoi de pratique pour moi et Céline)

TODO: Créer un utilisateur Heda. Séparer moi et Heda.

TODO: Les sources trop longues, ne pas montrer tout, mettre ... à la fin

TODO: Look at order classes to make the search always at the top when expanding:
https://getbootstrap.com/docs/4.0/layout/grid/

TODO : Linker les recettes entre elles. Ça serait tellement plus simple de simplement linker les recettes entre elles. class RelatedRecipe, belongs_to :recipe, belongs_to :other_recipe

TODO: <%# FIXME: WHYYYYY NOT WORKING anymore?!?!?! stylesheet_link_tag 'tiny-slider.css' %>

TODO: Be able to move items. Later item will have order:integer

How to link recipes from different languages?
UserRecipe belongs_to Language.
HedaRecipe would represent abstracted recipes identified by Heda.

For now we don't care. OOOOOOOOOOOOHOOOOOOOOOOOOOOOK! Only do my menus and my recipes. It's
all I need anyway to be able to retrieve recipes! Nothing else for now. And then the ability
to send recipes to friends.

You can complement your pantry ingredients with fresh, seasonal produce and herbs from your local market. That way, you’ll never get bored with the same ingredients.
https://www.culinarynutrition.com/stocking-a-culinary-nutrition-pantry/

Benefits to Stocking a Culinary Nutrition Pantry:
You’re more likely to cook meals at home because you don’t have to visit the grocery store for ingredients.
You’ll save money, as you won’t resort to takeout or restaurants.
You can pull meals together quickly and easily.
You can complement your pantry ingredients with fresh, seasonal produce and herbs from your local market. That way, you’ll never get bored with the same ingredients.
You’ll experience the joy of saying, ‘I have everything to make that!’ when you spy a heavenly-looking recipe on Pinterest.
You’ll be ready in the event of a natural disaster or zombie apocalypse.

Hey! Si la majorité de la clientèle est des femmes, je devrais me créer un compte sur pinterest. Pinterest et instagram peut-être. Lequel déjà le prof a dit que c'était en grand majorité des femmes? Et c'est génial pour faire de la publicité en montrant des recettes que j'ai cuisiné. Faire des belles recettes devrait être une priorité à commencer à faire.

Ah pouvoir voir les commentaires des autres utilisateurs? Juste des amis?
Quand tu crée un commentaire, ça serait cool de pouvoir le mettre: sois privé, sois pour les amis,
sois publique.

Ça me prendrait un 

OK, FUCK les images pour l'instant.
1. Les dimensions de l'images sont super importantes. Horizontal et vertical ce n'est vraiment pas la même chose. Donc ça serait mieux plus tard avec mes propres images.
2. Je ne voudrais pas vraiment hoster un site internet avec des images. Ça demanderait beaucoup trop de bandwith.
3. C'est probablement une zone grise légale d'utiliser les images sans permissions. Je crois que j'ai le droit, mais ça pourrait offuscer certaines personnes.
4. Simplement attendre et engager un photographe professionnel plus tard, avec mes recettes, et c'est ça que je veux de toute façon...

Ah, peut-être mettre une seule image par menu comme ça ça ferait beau!
Non, j'ai dit fuck off. Pas d'images pour l'instant.

Plus tard ça serait cool une banière en haut où le titre avec tous les mets sur une belle grande table à manger!!!

Au lieu d'un slider, ça pourrait être de cette manière aussi qu'on peut voir les menus. Tu descends de table à table et tu vois tous et là tu vois un truc dessus la table qui a l'air super bon et là tu cliques sur le menu!!!
Food table banner pour les menus!

Comment est-ce que ça fonctionnerais sur le cellulaire pour les menus?
Tu vois juste les catégories, les ratings et le nom des recettes.
Quand tu click sur une recette, ça fais une animation qui te tasses sur le côté et là tu
vois la partie de droite de la recette. (titre, source, image, un gros bouton voir, et le commentaire s'il y a lieu.

FIXME: Users can only edit their things. Their recipes.

Des étoiles jaunes quand ce n'est pas toi qui a voté. Des étoiles rouges quand c'est toi.

Je pense que je peux utiliser des images des sources dans mon menu. C'est du 'fair use'. Mes menus sont une sorte de review de recettes (ils ont un ratings) et c'est permis par la loi.
Les gens ne devraient pas se plaindre de toute façon parce que ça devrait emmener du traffic sur leur site internet.

Faire le menu avec des images pour le tofu.

Rating of recipes. In menu view? In recipe view? Sure, in both.
Mettre le site de recettes sur Heroku.

Faire un modèle distinct entre une recette et un lien.
Dans un menu, tu peux rajouter un lien, ou rajouter une recette.
Un lien va avoir: Un nom, un lien, des notes (tu peux rajouter des notes personnelles sur le lien), une image.
Ah je le sais pas. Attendre. Je ne sais pas ce que je veux exactement pour recette. Ça va dépendre comment est-ce qu'une recette est créé.

Mes ingrédients.
Vous pouvez faire 1260 recettes avec vos ingrédients en inventaire!

Glass milk jar. Rechercher ça pour avoir des bouteilles pour des liquides!

Objectif primordial: Faire du lait végétal! Du tofu aussi ça serait malade!

Ça prendrait un filtre, un peu comme "tea cup strainer", qui se mettrait par dessus un contenant. Et ça prendrait ensuite un outils pour écraser la pâte pour extraire le liquide.

Je pense de plus en plus que je cuisinerais dans des "pots" de stainless. Je ne sais pas.

Vidéos sur youtube:
- Assemblage de meuble ikea

Sur le site internet, ça serait bien d'avoir une carte avec toutes les entreprises partenaires qui fabriquent des meubles et des armoires de cuisine.

Au lieu que ce soit le contenu du four qui sort, ça pourrait simplement être le top du four qui se tasse. Ça pourrait ainsi fait four et cuisinière en même temps, pouvoir brasser ou fouetter en cuisant serait vraiment nice.

Pour mon logo, je veux quelque chose le plus simple possible. Je veux qu'il y ait au moins un élément
de robot et qu'il y ait au moins un élément environnemental. Avec ou sans le nom Heda. (Je dois réserver le nom Heda avant de faire ça...)

Pour différencier les menus qui sont réalisables avec Heda des autres menus, mettre mon logo à côté du nom du nom.

Essayer de faire du pop corn! Ça me prend un mini-couvercle!

La machine conserverait du beurre. Comme dans un beurrier avec de l'eau à l'envers? Il changerait l'eau
tout les jours.

Est-ce que la machine peut aider à faire des confitures? À stéréliser des pots?

Faire 2-3 modèles de belles armoires (allant de mélamine blanche, en passant par tout en bois, pour finir high end noir)

Je vais devoir sanitize les inputs des utilisateurs avant que ce soit recherchable. Par exemple,
s'assurer qu'il n'y a pas d'images sexuelles. (Sauf pour un menu pour adultes avec des alusions
sexuelles! et là confirmer que l'utilisateur qui regarde le site est majeur)

Les menus aussi peuvent être taggés végétarien, paléo...

Créer un menu sans compte!

Pas besoin de te créer un compte pour faire un menu et le partager.
Tu peux le modifier en créant un clone de ton ancien menu.
Tu dois te créer un compte si tu veux que tes recettes soit privés.
Évidemment ça te prends un nom et un mot de passe si tu veux que seulement toi les vois!
Te créer un compte t'aide à trouver tes menus.

Quand tu crée une recette, peut-être suggérer des recettes selon le nom de ce que tu as marqué du titre de la recette. Tu fais une recettes de muffins au bleuets, ça trouve des recettes qui ont un nom similaire à muffin à bleuets et ça te sors ces images là.

Créer une catégorie par défault qui s'appelle Principal quand tu crée un menu?

Peut-être offrir la possibilité de recevoir un token en email et là pouvoir faire des modifications avec ça.

Avertissement: En ne créant pas de compte
- Le menu est public. Tout ceux à qui vous donner le lien pourront voir le menu.
- Vous devez faire bien attention de ne pas perdre le lien!

Les gens peuvent opter oui ou non pour que le lien soit recherchable.
Attention, si vous ne voulez pas qu'on puisse chercher votre menu, vous devez
faire très attention de ne pas perdre le lien. Sinon il sera très difficile à retrouver!

À la fin de la création du compte, on peut t'envoyer un courriel avec le lien. Ou dès le début
pour être sûr de ne pas 

Objectif: 365 repas différent! 50 soupes! 100 desserts! 10 salades!

Les armoire de cuisines Ikea mesure 30" de large. Réalisable pour moi?!

https://www.homedepot.ca/fr/accueil/idees-instructions/cuisine/acheter-des-armoires-de-cuisine.html

TODO: Des options pour les recettes

ajouter 1, c. à thé, graines de lin || graines de chia
ajouter 1, c. à thé, oignons déshydratés || oignons en dés

Au lieu d'ouvrir et de déposer sur la tablette, ça serait cool de ne même pas avoir à ouvrir
la machine. Une petite porte rapide pour lui donner du lait, des oeufs. Ah je sais pas.

Une spatule qui épouse la forme du rebord du couvercle?

https://www.cuisineslaurier.com/en/styles/2238-contemporary-style.html
https://www.cuisineslaurier.com/en/styles/2241-rustic-style.html

Ça me prendrait du depth-of-field processing... comme three.js:
https://threejs.org/examples/webgl_postprocessing_dof.html

Seulement faire le modèle de sticker petit.

Au pire, pour les plus grand s'il y a plus de place, mettre dans grand sticker avec le petit dessus.
De l'inception de sticker.

Utiliser le format pour déterminer la profondeur de la tablette.

TODO: Un module sur le côté pour les boîtes de conserves. Elles rouleraient sur le côté.
Une seule largeur d'épaisseur. Le robot mets la conserve en haut, et les prends en bas.
Il faudrait demander au robot pour sortir les conserves.

Pas besoin de lave vaisselle si tu as déjà un lave-vaisselle chez toi?!

Ah maybe do the models normally inside freecad, with z-up coordinates.
Then simply rotate all the models when importing them so they become y-up coordinates.
Or maybe write a script that does this in freecad.

I prefer that it is Y-Up in my simulator. To me it makes more sense. And I don't want
to have to change what I wrote already.

But now I believe z should start from the back and go toward the front. It's the easiest to measure.
I can't measure using the doors... And this way I avoid negative z values.

https://www.youtube.com/watch?v=8mHnBRXWmaE
SOLIDWORKS Video: Changing from Y-Up coordinate to a Z-Up coordinate

Service de support à distance.

Si quelqu'un a une machine et déménage, leur donner 10% de rabais s'il laisse la machine sur
place et qu'il s'en achète une nouvelle.

L'idée est que c'est un nouveau client de plus.

Aussi, c'est stupide de déménager les gros électroménagers. Ben plus intelligents à Boston.

Dried soup in a jar.

TODO: Pour faire la faisabilité, faire les recettes en très petite quantité.
Faire un seul muffin de:
https://www.tasteofhome.com/recipes/gluten-free-chocolate-cupcakes/
Faire les recettes pour un seul oeuf.
Faire des soupes et des dessert cette semaine.
Me trouver 5 soupes et 5 dessert à faire cette semaine.

Apporter un petit dessert pour ma présentation haha?

Une extension pour les conserves peut-être? Je sais pas. Peut-être un must
d'avoir un minimum de conserve et d'être capable des les ouvrir.

Pour les ingrédients en faible quantité, utiliser des petits contenants qui seront lavé
sur un micro balance.

Complètement fermer aide vraiment à mitiger le bruit des moteurs.

Le lave-vaisselle sert aussi de réservoir d'eau potable, de chauffe eau et
de réservoir d'eau viscée. Possibilité de le brancher comme un lave vaisselle
normal pour qui pompe l'eau viscée et utilise l'eau du robinet.

Ça prends une bouilloire. Je suppos que tu peux mettre ta soupe au four, mais tu dois
mettre de l'eau bouillante, sinon ça prendrait une éternité. En même temps utiliser
l'eau bouillante pour le lave vaisselle et faire du café.

Peut-être utiliser des pots en métal, spécialement conçu pour aller au four. Mais
ça serait cool de pouvoir utiliser tout simplement les pots de vitres.

Boulettes végétariennes.

... in a jar.

Comparaison des différentes sources de fruits et légumes (surgeler, en conserver, secs, ...)
Voir dans le dossier sources.

Au pire, ne pas faire modulaire, et simplement avoir la possibilité d'enlever le panneau sur
le côté. L'autre module possèderais son propre bras, qui de toute façon devra être meilleur
que celui que je veux faire présentemment qui sert juste à prendre des pots.

Faire des soupes avec des légumes déshydrater.

La machine nettoie les pots. Ensuite la compagnie peut simplement les stéréliser
avant de les remplir de nouveaux.

Fonctionnalités de base.
- Un mini four (format air fryer), qui rentre un gros pot haut à l'intérieur ou 4 petits pots.
- Un mini lave-vaisselle qui lave un pot à la fois et des cueuillères.

C'est tout. Il ne brassera même pas la nourriture dans le pot.

La machine sera donc capable principalement de faire des soupes et des désserts.
Des soupes! Focuser gros sur les soupes.

IMPACT ENVIRONMENTALE DES PRÊTS-À-CUISINER:
https://ici.radio-canada.ca/nouvelle/1236049/etudes-pret-a-cuisiner-emballage-gaspillage-alimentaire
Si on enlève le suremballage, c'est plus écologique.

Heda, une armoire de cuisine intelligente

Heda, une alternative écologique au prêt-à-cuisiner.

Plus besoin de planifier ce que vous aller manger dans
deux semaines, planifier ce que vous aller manger demain!

Heda vous offre une multitude de possibilités.
Vous n'avez rien à manger, choississez une ou plusieurs
recettes qui vous tentes. La liste d'épicerie se fait
automatiquement selon votre inventaire et vous pouvez
même la faire livrer chez vous!

Avant la présentation, me mettre dans le mindset, mon
produit c'est le meilleur. Mon produit c'est le meilleur.
Mon produit c'est le meilleur.

Un jour. Démarrer un épicerie en gros qui fait du vrac.

Partenaire clé. Épiceries.

Cuisiner avec ce que vous avez sous la main ou
laisser nous s'occuper de votre inventaire.

Ça serait cool que simplement en cliquant, choississant les ingrédients disponibles,
ça te marque le nombre de recettes disponibles:

Farine
Lait
Beurre
Sel
1 recette
Sucre
3 recettes
...

En tout cas je délire ce n'est vraiment pas grave.

Environnement
Alimentation
Automatisation

Un garde-manger intelligent.
Un garde-manger robotique intelligent.
Un garde-manger robotisée.
A smart robotic pantry.
A robotic pantry.

https://www.google.com/search?q=pantry&client=ubuntu&hs=W6a&channel=fs&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjZ962BtN3uAhUBKqwKHR3MAAYQ_AUoAXoECAEQAw&biw=1376&bih=661&dpr=1.4

Compétiteur: AutoPantry: Automated Pantry Storage
https://storagemotion.com/autopantry/

Don't be greedy Pascal.

Ok. Regardons l'utilité avec une recette de boulette végétariennes:
https://www.ricardocuisine.com/recettes/4966-boulettes-vegetariennes

1 oignon, haché
1 gousse d’ail, hachée
2,5 ml (1/2 c. à thé) de flocons de piment fort broyés
30 ml (2 c. à soupe) d’huile d’olive
125 ml (1/2 tasse) de quinoa
180 ml (3/4 tasse) de bouillon de légumes ou d’eau
1 boîte de 540 ml (19 oz) de pois chiches rincés et égouttés
3 tranches de pain blanc, coupées en cubes (avec ou sans la croûte)
250 ml (1 tasse) de fromage parmigiano reggiano râpé
60 ml (1/4 tasse) d’olives Kalamata dénoyautées dans l’huile égouttées et hachées grossièrement
60 ml (1/4 tasse) de persil plat, ciselé
Sel et poivre
Farine
Huile d'olive ou canola pour la cuisson

Lave automatiquement la vaisselle du hâchoir et de la mandeline idéalement.

Besoin d'un outil pour ouvrir des conserves, pour faire bouillir de l'eau.

Mettre un écran sur l'armoire. Comme ça c'est possible de dire quoi faire
faire pour la recette, et surtout c'est possible de montrer ce qui se passe
avec la machine et pouvoir communiquer avec facilement. En tout cas,
commencer avec un écran. Et si ce n'est pas nécessaire, l'enlever. Mais, ça
risque d'être plus simple au début.

Hummus.

Dans le fond de l'armoire, des pots vides?

1. Hacher 1 oignon, 1 gousse d'ail
# Sortir l'huile d'olive
# Prendre un petit contenant
# Verser 1/2 c. à thé de flocons de piment fort broyés
# Prendre un moyen contenant
# Verser 1/2 t. de quinoa
# Prendre un moyen contenant
# Verser 3/4 t. d'eau
# Faire bouillir
# Verser de la poudre de bouillon de légumes
# Faire 3/4 tasse de bouillon de légumes
# Attendre
2. Attendrir l'oignon et l'ail avec le piment dans l'huile
3. Ajouter le quinoa et le bouillon, porter à ébullition
4. Couvrir et laisser mijoter 15 minutes ou jusqu'à ce que le bouillon soit
complètement absorbé.
# Préalablement, avoir fais trempé des pois chiches
# Avoir jeter l'eau, et remis de l'eau
# Les avoirs fait cuire
# Est-ce que je suis capable de mettre un pot entier avec de l'eau pour faire cuire des
# trucs dans le l'eau dans une fritseuse à l'air
# Ah non fuck off, il y aurait un cuiseur à riz ou autocuiseur conçu spécialement pour ça.
# Réduire les pois chiches en purée
# Mais ne même pas brasser. Ou je ne sais pas on va voir.
# Ça cuirait des petites quantités. Comme mes grands pots.
5.
 

Sélectionner tout
Ajouter à ma liste d'épicerie
Préparation

    Dans une petite casserole, attendrir l’oignon et l’ail avec le piment dans l’huile. Ajouter le quinoa, le bouillon et porter à ébullition. Couvrir et laisser mijoter doucement environ 15 minutes ou jusqu’à ce que le bouillon soit complètement absorbé.
    Au robot culinaire, réduire en purée lisse les pois chiches, la préparation au quinoa et le pain. Incorporer le reste des ingrédients. Saler et poivrer.
    Avec les mains légèrement huilées, façonner chaque boulette avec environ 15 ml (1 c. à soupe) du mélange de pois chiches. Les déposer sur une plaque farinée et bien les enrober de farine. Réserver.
    Dans une grande poêle, chauffer environ 1 cm (1/2 po) d’huile et dorer le tiers des boulettes à la fois de 2 à 3 minutes. Réserver au chaud sur une plaque munie d’une grille. Servir chaude ou tiède à l’apéritif.

Note

Avec le surplus de boulettes végétariennes, vous pouvez vous préparer un délicieux sandwich pour le lunch avec pain baguette, laitue, tomate et mayonnaise.

La pâte pour les boulettes s'émiettera si elle a été préparée la veille. Cuire le jour même dans la poêle ou sinon cuire au four à 200 °C (400 °F) sur une plaque tapissée de papier parchemin environ 10 minutes, ou jusqu'à ce que le fond soit légèrement doré.

Se congèlent.



*Particulièrement utile pour les végétariens!*

Avoir des pots dans les portes empêche de mettre des vitres dans les portes.
J'aurais quand même aimer, et c'est peut-être un must, de pouvoir voir ce que la
machine est en train de faire.

D'un autre côté, ça risque d'être très beau d'ouvrir et d'avoir les pots dans les portes.
Aussi, ça risque c'être très pratique pour du rangement. Mettre des trucs dans les portes
qui ne sont pas large. Épices, bouteilles, petits pots.

Tu mets les trucs sur le comptoir, lui il range tout. Les items seront toujours à la même
place, plus de chicane parce que quelqu'un d'autre les mets à la mauvaise place.

Recettes à essayer, voir l'utilité:
- Tofu général tao
- Tofu magique
- Riz cantonais

Tofu magique selon Loounie:
- Requiert frigo:
    - un bloc de tofu
    - sirop d'érable
    - sauce soya?
- Dans un bol:
    - verser 1 c. à soupe de vinaigre de cidre de pommes
    - verser 1 c. à soupe de sauce soja
    - verser 1 c. à soupe de sirop d'érable
- Dans un autre bol:
    - verser 30 g (½ tasse) de levure alimentaire en flocons
- Sortir:
    - 15 ml (1 c. à soupe) d’huile végétale pour la cuisson

Si tu ne connais pas la recette par coeur. Si c'est une nouvelle recette:
Écrire les étapes sur un tableau effaçable.
(Un tableau écrit avec de l'eau pourrait être cool si la recette ne s'efface
pas avant au moins une heure)

1. Défaire le tofu avec les doigts en morceaux de la groseur d'une bouchée.
2. Ajouter le mélange liquide et bien mélanger.
3. Ajouter la levure alimentaire et bien mélanger.
(offrir un choix entre cuisson à la poêle et cuisson au four
4. Cuire le tofu dans 1 c. à soupe d'huile environ 8 minutes, jusqu'à ce qu'ils soient bien dorés

Ragoût Loville:
- Requiert autres:
    - patate
    - navet
    - patate douce
    - oignon
    - ail
- Dans un bol:
    - ajouter une grande conserve de tomate en dé
    - ajouter une petite conserve de pâte de tomate
- Sortir:
    - les épices

1. Éplucher 2 oignons et ne conservez que les bonnes parties
ou 1. Préparer 2 oignons (un jour ça devient clair on entend quoi par préparer)
2. Préparer 3 patates, 3 patates douces, 1 navet et 4 gousses d'ail
3. Couper 6 saucisses italiennes en morceaux
4. Faire revenir les oignons et les saucisses.
5. Essayer de faire revenir les autres légumes.
6. Tout mettre dans le chaudron.
7. Rajouter du thym, ..., ..., ..., ..., ... (tout va être sorti)

Essayer (acheter) différentes soluttions pour couper des légumes.


***Faire des simulations ou c'est moi qui fait la job du robot.***
------------------------------------------------------------------
***Commander 1 repas sur GoodFood ou autre pour voir ce qu'ils font***
------------------------------------------------------------------

Application pour planifier les repas de la semaine et commander l'épicerie
est un must. Est-ce que ça existe déjà? J'ai grandement l'impression que oui,
mais aller voir mes compétiteurs et vérifier.

M'inscrire sur Ricardo cuisine.

Besoins auquels je réponds:
  - temps
  - *argent*
  - nouveauté
  - santé
  - confort

Peut-être focuser le plus possible sur la partie recettes. Nouveauté.

Hamburger
Croquettes pannée
Mayonnaise
Moutarde
Tortilla
Soupe minestrone 
Pizza
Sauce blanche
Salade de patate





The standard depth of most countertops is 25 inches deep.

I believe an object has many grab positions.
A grab position has a delta_x, delta_y and delta_z.
It also has an angle and a beta.
All these variables are modified based on the rotation of the object.
I can see that all these variables are refering to UserCoord.

A jar also has many grab positions. A grab to pick up. A grab to pour.

class Jar
  def grab_delta_pick_up
  def grab_delta_pour
end

So: Jar: grab_delta = 0.0, CONST.grab_offset

I am going to start with jars first it should be easier.

# Heda - The jar robot

Heda, les pros des pots

## Design

On jase. Ça serait cool de ne pas avoir besoin de four. Que le genre de four soit juste un couvercle qui descends sur les ronds à induction. Mais faudrait que ça chauffe l'air et pas juste la plaque... pas sûr que c'est une bonne idée haha.




It jars like no one else. (même principe que Schtruphs hahaha)

Ça serait teeeeellllement une bonne publicité, d'utiliser le nom de la compagnie ou du produit comme verbe comme les Strumphs. Tu sais que google c'est gros quand c'est devenu un verbe. Même chose pour Heda.

## Focus

JARS

Heda doesn't try to do everything in the kitchen. It does one thing, and one thing good. Jars and bottles.

If I only clean jars and bottles it's perfect.

-Inventory
-Cleaning
-Pour
-Spoon
-Scartch

Bonus: Cleaning tools like spoons and spatulas.

Fuck the rest.

No fridge.

Ce n'est pas grave que tout les ingrédients soient mis dans les pots séparés, Heda va les nettoyer.

## Language

10 integer
10.0 float
1/2 rational
$spoon => physical_object
@jar_id => jar

TODO:
(subcommand)
[array,of,elements,1,2,3]

## Design

Dans le fond, je veux juste analyser la recette pour aller chercher les ingrédients etc.

Dans le fond fond, c'est un preprocessor. Tu peux analyser. Sinon tu peux aussi rajouter d'autres commandes.

TODO: Valider que les commands qui ne sont pas dans le preprocessor sont quand même là...

J'aime beaucoup le fait d'avoir plusieurs niveaux de language de programmation.
Ainsi, le plus haut language peut être compiler différemment selon la machine que l'utilisateur
possède, selon ses outils disponibles.

What I like is that I can do insert_jar at the beginning instead of in the middle by compiling.

If I don't use a higher language like that, I would have if is_compiling? everywhere it would
be ugly.

The only things that sucks is that I have to use strings...

Ah, I know! Do it the other way around. In the higher language, instead of @commands += "..."
do:
if is_running?
end

## Unanswered questions

Un rouleau à pâte?
Des pots de 6" de diamètre?
Comment peser les petites quantités?
La hauteur des tablettes?
Comment battre la pâte?
Regarder une vidéo de pâtisserie de gâteau de mariage.

## Options

A sink with a drain under vs a countertop sink with a drain pump like in a dishwasher.

## Installation

For mittsu
```
sudo apt-get install libglfw3
sudo apt-get install libgl1-mesa-glx
```

For some reason, there is a bug when combining Mittsu with Rails. If you ever get an error coming
from the file ~/.rvm/gems/ruby-2.7.0/gems/mittsu-0.3.2/lib/mittsu/math.rb about the method untaint,
than edit and change this line:
```
BuiltInMath.methods.each { |m| public_class_method m }
```
to
```
BuiltInMath.methods.each { |m| public_class_method m unless m == :untaint }
```

Maybe required, I don't remember. Install if it complains.
```
sudo apt install imagemagick
```

This is more of a reference for me than a complete guide. How to install each dependency may vary.

### Install RVM (ruby version manager)
```
gpg --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
curl -sSL https://get.rvm.io | bash -s stable --ruby
source /home/pascalr/.rvm/scripts/rvm
echo 'source "/etc/profile.d/rvm.sh"' >> ~/.bashrc
```

### Install yarn (for rails)
```
https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

### Install node
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.36.0/install.sh | bash
# close terminal and open again
nvm install node
```

### Install rails
```
gem install rails
```

## Usage

To start the website:
```
rails s
```

To start the simulation:
```
rails r lib/brain.rb
```

## Contributing

Take a look at map.dia to understand the structure.

## License
TODO

## Design

The first version will only have things that are safe. It will not have a hand blender and it will not
have a knife. You will need to have your own blender if you want wont.

Ah maybe a future version will have a danger zone. A place on the side where there can be:
- A cutting board
- Knives
- A hand mixer with a knife
- A blender

The only danger though is the grip. I am not sure about what I juste wrote.

## Deprecated
Petit TODO list:
- Post processing pour rendre l'image belle
- Verser correctement
- Turn the lid when unscrewing
- Unscrew rapidement (ne pas reappeler goto à chaque fois)
- Vitesse des déplacements selon les moteurs
- Argument d'une commande qui peut être une sous-commande en parentaise (sous_commande)
- Programmer chauffer pour que ça dure une seconde seulement, le signal doit être retransmit à toute les secondes pour que ça continue de chauffer. Donc si l'ordinateur plante, ça ne continue pas à chauffer. Security feature.
- Checker les statistiqes ne nombre de feux causer par de cuisinière. Je crois que je peux faire mieux.
- Enlever la tablette du haut prendre la moitié pour un four? L'autre moitié pour des outils comme une mixette à main et un broyeur à main?
- get_wolrd_position and get_world_rotation not working
- when closing Heda, send state to server
- Enlever repas en retard. La machine a une liste de recette. Et tu peux lui dire d'attendre avant de faire une recette. Mais peut-importe si en retard.
- Si jamais brasser est un problème parce que ça tasse la poêlone, fabriquer une spatule qui brasse une peu comme une mixette, comme ça ne cherche pas à tasser la poêlone.
- Pour la spatule électrique, mettre un embout pour pétrir la pâte.
- Deux outils électrique: (Lent: spatule, pétrir, Rapide: Fouetter, battre, nettroyer, trancher)
- Une brosse, qui tourne, qui peut mettre de l'eau, du savon, en dessous, le bras va par dessus et mets le chaudron ou l'ustensil par dessus.
- Ah ou bien simplement une brosse électrique. Le bras mais le chaudron dans l'évier et prends la brosse électrique dans son bras et la passe sur la vaisselle. Plus compliqué pour les ustensiles par contre. Au pire elle n'est pas capable de faire les ustensiles...
- Mouse wheel, déplace la caméra et non zoom.
- Évier
- Add start_x, end_x, start_z, end_z to shelves
- Peut-être donner une couleur qui ne ressemble pas à une couleur peau pour les poignées. Comme ça c'est plus sécuritaire.
- Le robot doit être capable de se laver la pince peut-être?

TODO list, après demande de brevet:
- Collisions

La force de grip doit être élevé pour être capable de dévisser les pots. Alors pas le choix, la machine sera fermée. Si je veux qu'elle soit ouvert, le faire plus tard. Pour l'instant fermé et sécuritaire.


- calling update_world_matrix withtout true at least fucks things up and returns bad world_coordinates

- Quand tu click sur les commandes rapide, ça les rajoute dans le text area seulement.
- Rajouter "Seed a jar", qui rajoute "grab_fixed_jar |", et là avec l'autocomplete pourun nom d'aliment, puis l'autocomplete pour un format de pot. Ça prendrait un tooltip.
- Autocomplete quand créer des commandes.
- Ranger des pots en dessous du bras aussi. Ah peut-être seulement. Proablement pas finalement.
- Separate ingredient in two. Ingredient and IngredientData

The brain is always working on the oldest meal not done.

You cannot add a meal before now.

Ok let's say you changed your mind and you want to cook something what is scheduled to be cooked in 5 minutes. Well try to launch it, when it will complain that there already something being done in 5 minutes, tell it what you want to be done.

There cannot be an endtime in the database for meals. Because if the machine as a problem, or whenever a user has to do something he doesn't right now, then it can push all the following recipes later.

Weight is always in gram and volume in mL.

Au lieu d'appeler ça Commands, appeler ça Language. Il y a plusieurs langue:
- Recipe Language: ajouter, verser, ...
- Brain Language: cook recipe_name
- Meta Language: check_invalid_states
The body language is not so much a language. It does not have the same structure.
- Body Language: mh123.123y123.123

# OK. No need to pass (jarOrId), only jar, if you want to be able to pass id,
# later it will be by doing grab (find_jar 10) or cook (find_recipe soupe à l'oignon)

-Focuser pour me sentir bien au lieu de focuser sur être productif?
-Je ne sens pas bien quand je ne me trouve pas productif, et je ne suis pas productif quand je ne me sens pas bien.

# TODO: A cheatsheet document in damps-sands.
# TODO: Puts this in a rails cheatsheet.
Channels:
https://guides.rubyonrails.org/action_cable_overview.html
# rails g channel Mychannel
app/channels/my_channel.rb # Server logic def subscribed, 
app/javascript/channels/consumer.js
app/javascript/channels/my_channel.js # Client logic
ActionCable.server.broadcast("chat_Best Room", body: "This Room is Best Room.")

Class.new.extend(UsefulThings).get_file


- Rajouter un pretty_instructions
-> Rajouter aux unités t: long_name_singular: tasse, long_name_plural: tasses
ajouter 2, t, farine devriendrait
Ajouter 2 tasses de farine (je sais pas si ça serait compliqué, oublié ça pour l'instant.)
(le "de" je ne sais pas si c'est compliqué)



<% @shelves.each do |shelf| %>
  <div class="drawing_shelf">
    <%= tag.svg height: shelf.depth, width: shelf.width do %>
      <% shelf.locations.each do |loc| %>
        <% if loc.occupied? %>
          <%= tag.circle cx:loc.x, cy:shelf.depth-loc.z, r:loc.jar.jar_format.max_diameter/2, stroke:"black", "stroke-width": 2, fill: "#fc9e32" %>
        <% else %>
          <%= tag.circle cx:loc.x, cy:shelf.depth-loc.z, r:loc.jar.jar_format.max_diameter/2, stroke:"black", "stroke-width": 2, fill: "#edcb98" %>
        <% end %>
        <%= tag.text loc.jar.ingredient.name, {lengthAdjust: "spacingAndGlyphs", textLength: 80, dx: -40, x:loc.x, y:shelf.depth-loc.z, fill: "black"} %>
        <%# tag.text loc.jar.ingredient.name, {dx: -loc.diameter/2, x:loc.x, y:shelf.depth-loc.z, fill: "black"} %>
      <% end %>
    <% end %>
  </div>
<% end %>

Enlever recipe_quantities, parce que ça devient compliqué avec les versions. Tu veux rajouter lequel???
À la place, pour chacun des ingrédient, tu peux linker une recette pour fabriquer cette ingrédient.

Ça devient compliqué, mais c'est ça qui est ça: For Mayonnaise. There is:
Mayonnaise: Item, Mayonnaise: Recipe, Mayonnaise: Ingredient.

TODO COOL MAIS PLUS TARD: À côté des images dans la liste des items, rajouter une flèches pour pouvoir
voir toutes les recettes qui ont des images.

Exemple d'instructions:

recette pizza pepperoni fromage
faire 1 pâte à pizza
faire 1 sauce à pizza
ajouter 20 pepperoni
ajouter 2 t fromage mozzarella
cuire 18 min 350°C

ces commandes n'exécute pas réellement ce qu'il faut faire, ils font juste process la recette.
"faire" process la recette donnée, et rajouter "do_make" à la liste de commande
"ajouter" process rajouter l'ingrédient à la liste d'ingrédient, et rajouter la commande
"do_add" à la liste de commande
"cuire au four" rajouter le temps de cuisson et la température de cuisson à la recette.

comment est-ce que ça va marcher pour la traduction?

todo: pour une question de sécurité, rajouter un scope aux commandes.
par exemple, process une recette peut seulement executer une commande de RecipeCommands

It would be nice variables like: grab $jar_in_vise

Changer la couleur du rond qui chauffe en fonction de la température simulé.

Show collisions in red?

Un mur pour que le plat de cuisson puisse s'accôter dessus?

Allow $variables in Macro??

Duck Typing

https://stackoverflow.com/questions/14575581/can-i-tell-a-ruby-method-to-expect-a-specific-parameter-type

I'm late to the party, but I wanted to add something else:

A really important concept in Ruby is Duck Typing. The idea behind this principle is that you don't really care about the types of your variables, as far as they can do what you want to do with them. What you want in your method is to accept a variable that responds to (*). You don't care about the class name as far as the instance can be multiplied.

Because of that, in Ruby you will see more often the method #responds_to? than #is_a?

In general, you will be doing type assertion only when accepting values from external sources, such as user input.




J'ai oublier de spécifier que pour le deux bras, ce que j'ai fait et que je trouvais cool
c'est de faire un mode mirroir, où les deux bras font le même mouvement, mais en mirroir.
Ça marchait bien pour dévisser un couvercle à 2 bras.
# FIXME: For mirror mode
#if mirror_mode
#  pos = other_arm.send(m.axis)
#  pos += m.dir_pos ? -step : +step
#  other_arm.send("#{m.axis}=", pos)
#end

Ok. Fuck les threads. La simulation roule à part. Je dois simplement échanger l'information pour que la simulation est accès au variable de Heda. Je vais essayé de serializer tous les changements aux objets pour...
osti que c'est compliqué...

JE VEUX:
- SIMPLE À DÉBUGGER (IDÉALEMENT PAS DE THREAD. CHAQUE APPLICATION SÉPARÉ)
- MONTRER CE QUE LE SERVEUR VOIT.
- LE SERVEUR DOIT AVOIR TOUT LE POSITIONNEMENT DES OBJETS EN MÉMOIRE (POUR COLLISIONS)

Est-ce que ça serait possible de mettre la logique ailleurs que dans rails?

CLIENT
CLIENT ---> APP WEB ---> SERVEUR ---> PSEUDO LANGAUGE PROG ---> SIMULATION ---> PSEUDO GCODE --> SLAVE
CLIENT
CLIENT

Nooooooooooon pas en three.js parce que j'en ai de besoin en ruby pour faire collision detection pour planifier des trajets.

Idéalement, je simule le slave. Je ne fais que déplacer le mouvement de Heda, des objets de la scène.
(Un must pour object collision). Et à caque 1/60e de seconde, je call update de la vue.

Tu envoies une commande. Rails l'execute. Rails ouvre un channel pour donner
la position en tout temps à Three.js. Quand il vient le temps de faire un mouvement,
tout ce qu'il fait c'est modifier le mouvement lentement (selon le speed).

Donc la simulation, idéalement c'est un process à part, comme ça j'ai son log. Ce qui est chiant par contre est que
je dois démarrer 2 trucs. Ça pourrait être un deamon et je tail -f son log.

Anyway, le plus gros problème est que je veux que ce qui soit affiché soit la vision de ce que le serveur pense de ce qu'Heda est en train de faire.
Assumes that the slave is perfect. Anyway it has too...

Donc je ne veux pas vraiment de SIMULATION_HEDA, seulement un SERVER_HEDA. Idéalement, une commande Open simulation, qui crée la fenêtre. Une commande Close simulation qui ferme la fenêtre.
Et pouvoir l'update. Donc le flow.

Je n'y arrive passsssss.....
Byebug fuck maudit criss.

class Simulation {
  def start
  def stop
  def update
}

Open simulation.
Shows the state of SERVER_HEDA.
Grab fixed jar.
--> lib/communicate.rb: slowly move, then either read arduino or update simulation
Close simulation.

Mais pour faire cela, je dois monkey patch Window. Je vais hériter de window.

Donc le code modifie tout le temps la position de Heda lors d'un déplacement. Quand c'est le vrai,
il lit aussi pour voir ce que l'arduino lui répond.

Le raspberry pi roule à 1.5 GHz au lieu du 16 MHz du arduino, ça serait beaucoup plus simple pour les steps? Mais est-ce que GPIO est rapide? Et le problème c'est que tu ne peux pas dormir des nanosecondes...



TODO: Calculate the rotations using Mittsu?
Make the robot one object, with many children?
-Heda
--Carriage
---Arm  
----Forearm
-----Hand
------Fingers
------Jar
------Tool
But I like the way this is done now because I can easily reverse engineer to calculate the
movements required to get to the destination and this way I validate that this works.
So let's probably not do this. But I think I should for the hand. Make one object for the
hand, and the others be a children of this object... I don't know...

TODO: Add validations for every config. For jar formats especially. Volume can't be 0.0, etc.

Coord y is y. No more v. Y is fine.

Coord h is fine, because x and h is really not the same thing. x depends of t and a also.

Scan 3d? Sinon comment le robot va être capable de détecter le format de la casserole et 
des trucs devant lui. Oui scan 3d je crois, mais un jour, pas maintentant.

Utiliser ou me baser sur OpenSCAD pour créer les modèles.

In the rare event that your application needs to run some code before Rails itself is loaded, put it above the call to require "rails/all" in config/application.rb.

config.autoload_once_paths accepts an array of paths from which Rails will autoload constants that won't be wiped per request. Relevant if config.cache_classes is false, which is the default in the development environment. Otherwise, all autoloading happens only once. All elements of this array must also be in autoload_paths. Default is an empty array.

TODO: Rails.application.routes.routes
http://hackingoff.com/blog/generate-rails-sitemap-from-routes/
Appeler les routes dynamiquement au lieu de faire '/....', parce que ça ne fonctionne pas avec les scopes



Speedrun FreeCAD. Il y a un blueprint, par exemple du Taj Mahal.
Les règles. Modéliser exactement selon les mesures du plans.
Les seuls valeurs qui peuvent être entrés sont des valeurs du plan.
(Tu ne peux pas précalculer par exemple de valeur pour des courbes.)



RUBY VS C++

C++ is more stable long term
A lot of librairies (like openCV)




Ruby is way faster to develop
En gros je suis pratiquement en train de réécrire ruby en c++ ce que je trouve stupide.




Ok pour faire tout en ruby, je vais devoir passer à travers des executables.
Fuck avoir un serveur.





Workflow:

Serveur ruby on rails qui va rouler sur le raspberry pi.











Rails.application.routes.routes
Rails.application.routes.routes.map { |r| {alias: r.name, path: r.path.spec.to_s, controller: r.defaults[:controller], action: r.defaults[:action]}}

TODO: Put updated_at and created_at at the end.
In the controller: @columns = ...
then put created at and updated at at the end

TODO: DELETE database_record
TODO: CREATE database_record

call .model_name et .id sur l'objet.

Mettre My images et My items dans More

!!!Tag hierarchies!!!
Déssert -> Gâteaux
        -> Biscuits

Ok les potages, soupes et crème seront tous ensemble sous soupe, parce qu'en anglais il n'y a pas tant de distinction.
Je rajouterai un tag au pire.

Bon ben si la seule distinction entre un item et un tag c'est l'image, ben ENLEVER les items et SEULEMENT GARDER les tags.
Simplement référencer la même image pour chaque recette de l'item...

Faire un rake task, prendre tous les items qui ont plus de une recette, créer un nouveau tag avec le nom de l'item.
Regarder si l'item a une image, si oui, mettre cette image pour chacune des recettes.

Faire la vue de déssert avant cependant.

Dans le menu principal, quoi afficher?

Afficher les tags sous les tags? Peut-être garder les items dans le fond.

Déterminer quoi faire avec la vue principale avant de modifier ça.

Règle #1... Seulement modifier une fois que ce soit nécessaire.

La distinction entre un tag et un item c'est l'image. Les recettes sous le même tag doivent pouvoir être représenté par la même image.

Faire une hiérarchie?
En général ma réponse est fuck les hierarchies. C'est bien mieux des tags.

Déssert (on voit une assiette avec plein de déssert)
-> Gâteau (on voit une assiette avec plein de gateaux)
-> Gâteau au carotte

Non c'est pas bon ignore cette idée précédente?

Quelle vue faire pour un tag? La même que le menu principal? Non si je veux le menu principal, ben être sur le menu principal.

La vue d'un tag pourrait être la même que la vue d'un item.

Végétarien tu veux que ce soit un filtre, c'est vraiment pas le même titre que Déssert.

Rajouter attractativeness aux items? Ou bien simplement appeler ça priority encore une fois.

Seulement garder la première partie de la source quand c'est un site internet pour que ça prenne moins de place

Pour les catégories, utiliser une image avec plusieurs sortes dessus.

Use Image, because this way they can be reused.
Every recipe has one picture (maybe more later)
And an item has a default Image

TODO: Validate that the recipe has at least one tag.

Une 4e case en à droite au millieu.

Peut-être même 6 cases un jour.

https://stackoverflow.com/questions/53629110/how-to-display-svg-as-images-with-active-storage
FIXME: Make this safe before releasing application.

I think: Uploading svg files is fine. But they should be converted to png and pngs only should be shown to the user.

# Hack for allowing SVG files. While this hack is here, we should **not**
# allow arbitrary SVG uploads. https://github.com/rails/rails/issues/34665

ActiveStorage::Engine.config
.active_storage
.content_types_to_serve_as_binary
.delete('image/svg+xml')


yarn install svgexport

C'est des recettes que ça me prends.
Fuck les features.
Rester simples.
Des recettes.
Demander à mom une vidéo du livre de recette.

Planifier mon calendrier pour vrai et cuisinner pendant la journée.

Acheter une courge butternut pour pouvoir prendre une photo du potage.

Acheter des bleuts pour pouvoir prendre une photo des muffins.
Et acheter des bleuets pour cuisiner mes muffins haha.

Trouver tous les ingrédients de mes recettes avec les sources.


RAJOUTER DES STYLES D'UNITÉS.
- (g, L)
- (cc, cs, t)

TODO:
Raw instructions
Montrer les instructions une fois parser
Multiplier les quantités

Si je veux avoir mes usagers un jour qui utilise le site.
https://www.sitepoint.com/password-less-authentication-in-rails/
rails g scaffold user fullname username:uniq email:uniq login_token token_generated_at:datetime

Laisser l'utilisateur tout de suite faire des modifications au calendrier, mais lui dire, aye, tes
modifications seront perdu si tu ferme la page (ou libère tes cookies). Alors inscris ton
addresse courriel pour pouvoir te reconnecter. (Aucun autre message ne sera envoyé)

https://github.com/excid3/simple_calendar

Ok, pour l'application. Pas de GUI. Simplement un site internet qui va rouler sur le raspberry pi.

J'aurais aimé ça que des utilisateurs puissent utiliser l'application sans avoir la machine.

Bon ben d'abord je vais un jour rendre le site hedacuisine.com dynamique. Les utilisateurs pourront se créer un compte
se faire leur propre recette et se faire un calendrier, pi toute pi toute.

En même temps l'avantage pour l'utilisateurs c'est que je backup leur données. Mais bon ça c'est plus tard.

For example, Twitter uses its public API in its web application, which is built as a static site that consumes JSON resources.

Rajouter des recettes similaires aux recettes.

Tu peux réutiliser le couvercle de pot de sauce avec l'étiquette, quand tu
ouvres un nouveau pot de sauce, tu gardes le même pot.

Installer sqlitebrowser pour copier les bases de données.

Avant de virer fou:

Comment gérer les bases de données?

J'ai de l'information dans heda-recipes:
Recipe
Unit
Ingredient
IngredientQuantity

J'ai de l'information dans heda-client:
Recipe, heda_id
Unit, heda_id
Ingredient, heda_id
IngredientQuantity, heda_id

Action:

Je suis sur mon application, c'est tout nouveau. Je clique mes recettes. Il y en a aucune.
Je clique sur bibliothèque, je vois les recette qu'il y a sur hedacuisine.

Je clique sur une recette l'étoile qui apparaît quand je suis sur une recette.
La recette devient dans les recettes.

Si des User veulent mettre en favoris des choses différents, ils n'ont qu'à se créer un tag #Pascal et se tager sur les recettes.

Tu peux créer une recette basé sur une autre recette. Oeufs matinaux à la Pascal, basé sur une autre recette (pour copier image et les trucs, puis tu modifie.)

Tu ne peux pas modifier une recette, tu peux juste la copier, la renommer puis la modifier puisqu'elle est à toi.

Tu peux partager des recettes! C'est peut-être ça la pièce du puzzle qui manque.

Comment est-ce que 2 amis peuvent se partager une recette?
Par email.

Comment est-ce que les données sont backup? Les recettes créé doivent être backup sur l'internet.

Ouin le backup c'est un problème plus tard. Peut-être offrir un forfait pour le backup.

Ok, hedacuisine est statique en attendant d'avoir des usagés.

Les usagés vont modifier leur recette sur mon site web en se créant un compte. L'avantage est backup automatique pour eux je gère tout.

L'application Heda elle: Elle gère Heda, et tu entres ton mot de passe et ton nom d'utilisateur du site. Les recettes

Ok c'était cute de vouloir mettre ça static, et c'est correct pour l'instant, mais plus tard non.

Partager dans les réseaux sociaux un jour.


KEEP heda-recipes independant from the rest.

you get data from it from http, no the db directly

TODO: !!!!!!!!!!!!!!!!!!!!!!!!!
grep for localhost to make sure there are no links left with localhost!!! (bad links!!!)
minify the output of wget, or actually just download the production server instead of development
TODO: !!!!!!!!!!!!!!!!!!!!!!!!!

rails server --binding=0.0.0.0

https://fsymbols.com/signs/arrow/

TODO: Rajouter des variantes aux recettes. Comme ultimate guitar?

Javascript:
https://www.botreetechnologies.com/blog/introducing-jquery-in-rails-6-using-webpacker

https://stackoverflow.com/questions/54501241/rails-5-6-how-to-include-js-functions-with-webpacker/56549843

TODO: Lazy load images...

TODO: Store all images as the small version actually required...

https://github.com/verlok/vanilla-lazyload
https://alfy.me/2019/10/18/everything-you-need-to-know-about-images-loading.html

Simplement une armoire intelligente? Avec un scanner, un ordinateur et un écran. Te donnes des
suggestions de recettes avec ce que tu as. Non, parce qu'il manque de peser les pots...
