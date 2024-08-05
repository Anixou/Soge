"use strict";

import Game from "./game.js";
import { check_collision, check_collision_all_entities, gravity } from "./movement.js";
import Player from "./player.js";

const spawn_param = {
    x:0,
    y:0,
    id:1,
    speed_min:0.1,
    speed_max:10,
    acceleration:0.1,
    width:50,
    height:50,
    color:'red',
    css_id:'player',
    gravity_max:20,
    gravity_min:1,
    jump_speed:20,
    jump_height: 300,
    speed_in_air : 2
}

let game = new Game;

game.add_frame();
game.set_entities_list();

let player = new Player(spawn_param.id,spawn_param.x,spawn_param.y);

game.entities.push(player);

player.create_player_element(spawn_param.height,spawn_param.width,spawn_param.css_id,spawn_param.color)

player.render_player_movement();


player.set_player_movement(spawn_param.speed_min,spawn_param.speed_max,spawn_param.speed_in_air,game.entities,spawn_param.acceleration);

player.active_collision(game.entities);


let player2 = new Player(2,500,150);
game.entities.push(player2);
player2.create_player_element(40,50,'test',"blue")
player2.active_collision(game.entities);
player2.render_player_movement();

player.active_gravity(spawn_param.gravity_max,spawn_param.gravity_min,game.entities);
player.set_jump(spawn_param.jump_height,spawn_param.jump_speed,game.entities);


// let player3 = new Player(3,1,750,0);
// game.entities.push(player3);
// player3.create_player_element(frame,40,50,'test2',"yellow")
// let player_box3 = document.getElementById("test2");
// player3.active_collision(game.entities);
// player3.render_player_movement(player_box3);

addEventListener("keydown", (e)=>{
    if (e.key === "t"){
        console.log(player);
        // check_collision_all_entities(player, game.entities).then(e => console.log(e));
        
    };
})
