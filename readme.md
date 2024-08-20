# Soge 

Soge est un moteur de jeu en javascript permettant de créer des jeux de plateforme en 2D facilement.

Vous disposerez dans le dossier 'game' d'un exemple d'utilisation que vous pouvez essayer en lançant 'index.html' avec Live Server.

Quelques conseils : 

- Lisez la JSdoc des fonctions

- Penser à activer la collision avant la gravité

- Penser à clear vos interval à la fin d'un niveau, les intervals créée par Soge peuvent être clear individuellement via des fonctions précises ( ex = player.clear_gravity). Mais aussi via la fonction .die() qui effacera toutes les intervals d'une entité.
Et plus globalement game.clear_frame() qui effacera toutes les intervals de toutes les entités.

- La gravité minimale d'un joueur doit absolument être supérieure à 1

- Si vous desirez faire une plateforme mouvante pour le joueur, assurez vous que la vitesse en descente de la structure soit inférieure à la gravité minimlale du joueur

- Libre à vous d'ajouter les propriétés et/ou fonctions nécessaires à votre jeu