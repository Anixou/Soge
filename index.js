"use strict";

import Game from "./game.js";
import { check_collision, check_collision_all_entities } from "./movement.js";
import Player from "./player.js";
import Structure from "./structure.js";


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
console.log(globalVar)

let s = new Structure(4,200,0);
await s.create_element(50,50,"s",'blue')
await s.render_movement();

s.move(200,1,'right');
    setTimeout(()=>{
        s.move(200,1,'left');
    },3000)

setInterval( ()=>{
    
    s.move(200,1,'right');
    setTimeout(()=>{
        s.move(200,1,'left');
    },3000)


},6000)




let player = new Player(spawn_param.id,spawn_param.x,spawn_param.y);
player.create_element(spawn_param.height,spawn_param.width,spawn_param.css_id,spawn_param.color);
player.render_movement();
player.active_collision();
player.set_movement(spawn_param.speed_min,spawn_param.speed_max,spawn_param.time_for_max_speed);
player.active_gravity(spawn_param.gravity_max,spawn_param.gravity_min);
player.set_jump(spawn_param.jump_height,spawn_param.jump_speed);




addEventListener("keydown", async (e)=>{
    if (e.key === "t"){
        console.log(globalVar)
        console.log(await player.collapsed(s));
    };
})
