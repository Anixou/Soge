"use strict";

import add_frame from "./frame.js";
import Player from "./player.js";

console.log(window.innerWidth, window.innerHeight);

let entities = [];

console.log(entities); // Outputs 8

add_frame();
let frame = document.getElementById("frame");

let player = new Player(10,0,0);
player.create_player_element(frame,50,50)
entities.player = player;

let player_box = document.getElementById("player");

player.set_player_movement(entities);
player.active_collision(entities);

player.render_player_movement(player_box);

