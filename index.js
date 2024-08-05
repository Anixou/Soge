"use strict";

import Game from "./game.js";
import { check_collision, check_collision_all_entities, gravity } from "./movement.js";
import Player from "./player.js";

const spawn_param = {
    x:700,
    y:701,
    id:1,
    speed_min:0.1,
    speed_max:10,
    time_for_max_speed:500,
    width:50,
    height:50,
    color:'red',
    css_id:'player',
    gravity_max:20,
    gravity_min:1,
    jump_speed:50,
    jump_height: 300,
    speed_in_air : 5
}

let game = new Game;

game.add_frame();
game.set_entities_list();

let player = new Player(spawn_param.id,spawn_param.x,spawn_param.y);

game.entities.push(player);

player.create_player_element(spawn_param.height,spawn_param.width,spawn_param.css_id,spawn_param.color)

player.render_player_movement();


player.set_player_movement(spawn_param.speed_min,spawn_param.speed_max,game.entities,spawn_param.time_for_max_speed);

player.active_collision(game.entities);


let player2 = new Player(2,500,400);
game.entities.push(player2);
player2.create_player_element(15,1500,'test',"blue")
player2.active_collision(game.entities);
player2.render_player_movement();

player.active_gravity(spawn_param.gravity_max,spawn_param.gravity_min,game.entities);
// player2.active_gravity(spawn_param.gravity_max,spawn_param.gravity_min,game.entities);
player.set_jump(spawn_param.jump_height,spawn_param.jump_speed,game.entities);


let player3 = new Player(3,0,200);
game.entities.push(player3);
player3.create_player_element(40,500,'test2',"yellow")
player3.active_collision(game.entities);
player3.render_player_movement();

addEventListener("keydown", (e)=>{
    if (e.key === "t"){
        console.log(player.is_falling,player.immobilised);
        // check_collision_all_entities(player, game.entities).then(e => console.log(e));
        player.unset_player_movement();
    };
})
addEventListener("keydown", (e)=>{
    if (e.key === "x"){
        console.log(player.is_falling,player.immobilised);
        // check_collision_all_entities(player, game.entities).then(e => console.log(e));
        player.set_player_movement(spawn_param.speed_min,spawn_param.speed_max,game.entities,spawn_param.time_for_max_speed);
    };
})
