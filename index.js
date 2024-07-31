"use strict";

import Game from "./game.js";
import Player from "./player.js";

let spawn_param = {
    x:620,
    y:60,
    id:1,
    speed:1,
    width:50,
    heigth:50,
    color:'red',
    css_id:'player'
}

let game = new Game;

game.add_frame();
let frame = document.getElementById("frame");
game.set_entities_list();

let player = new Player(spawn_param.id,spawn_param.speed,spawn_param.x,spawn_param.y);

game.entities.push(player);

player.create_player_element(frame,spawn_param.heigth,spawn_param.width,spawn_param.css_id,spawn_param.color)

let player_box = document.getElementById("player");


player.set_player_movement(game.entities);

player.active_collision(game.entities);

player.render_player_movement(player_box);

let player2 = new Player(2,1,620,0);
game.entities.push(player2);
player2.create_player_element(frame,40,50,'test',"blue")
let player_box2 = document.getElementById("test");
player2.active_collision(game.entities);
player2.render_player_movement(player_box2);

player.active_gravity(2);


// let player3 = new Player(3,1,750,0);
// game.entities.push(player3);
// player3.create_player_element(frame,40,50,'test2',"yellow")
// let player_box3 = document.getElementById("test2");
// player3.active_collision(game.entities);
// player3.render_player_movement(player_box3);

addEventListener("keydown", (e)=>{
    if (e.key === "t")console.log(player,game.entities);
})
