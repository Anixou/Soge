# Soge 

Soge is a JavaScript game engine that makes it easy to create 2D platformer games.

In the 'game' folder, you will find an example usage that you can try by opening 'index.html' with Live Server.

Some tips:

- Read the JSDoc for the functions.

- Remember to activate collision before gravity.

- Remember to clear your intervals at the end of a level. Intervals created by Soge can be cleared individually via specific functions (e.g., player.clear_gravity). They can also be cleared using the .die() function, which removes all intervals for an entity. More generally, game.clear_frame() will clear all intervals for all entities.

- The minimum gravity of a player must be greater than 1.

- If you want to create a moving platform for the player, make sure that the downward speed of the platform is less than the player's minimum gravity.

- Feel free to add any properties and/or functions necessary for your game.