"use strict";

import Game from "./game.js";
import { check_collision, check_collision_all_entities } from "./movement.js";
import Player from "./player.js";

const spawn_param = {
    x:500,
    y:0,
    id:1,
    speed_min:1,
    speed_max:10,
    time_for_max_speed:1000,
    width:50,
    height:50,
    color:'red',
    css_id:'player',
    gravity_max:20,
    gravity_min:1,
    jump_speed:50,
    jump_height: 200
}

let game = new Game;

game.add_frame();
game.set_entities_list();

let player = new Player(spawn_param.id,spawn_param.x,spawn_param.y);
player.create_player_element(spawn_param.height,spawn_param.width,spawn_param.css_id,spawn_param.color);
player.render_player_movement();
player.set_player_movement(spawn_param.speed_min,spawn_param.speed_max,spawn_param.time_for_max_speed);
player.active_collision();
player.active_gravity(spawn_param.gravity_max,spawn_param.gravity_min);
player.set_jump(spawn_param.jump_height,spawn_param.jump_speed);

let player2 = new Player(2,700,800,1)
player2.create_player_element(spawn_param.height,spawn_param.width,'test','violet');
player2.active_collision();
player2.render_player_movement();
player2.active_gravity(spawn_param.gravity_max,spawn_param.gravity_min);

setInterval(async()=>{
    if (await player.collapsed(player2))
    {
        console.log('collapsed4')
    }
},10)



addEventListener("keydown", async (e)=>{
    if (e.key === "t"){
        console.log(player.collapsed(player2));
        console.log(globalVar);
        // check_collision_all_entities(player, game.entities).then(e => console.log(e));
        // player.die(game.entities);
    };
})
