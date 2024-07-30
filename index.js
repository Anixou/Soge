"use strict";

import add_frame from "./frame.js";
import Player from "./player.js";

add_frame();
let frame = document.getElementById("frame");

let player = new Player();
player.create_player_element(50,50,frame)

let player_box = document.getElementById("player");

player.set_player_movement(player_box);

player.render_player_movement(player_box);

