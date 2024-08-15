"use strict";

import Game from "./class/game.js";
import Monster from "./class/monster.js";
import Player from "./class/player.js";
import Structure from "./class/structure.js";
import {detect_collapse_all_entities} from './movement.js';


const spawn_param = {
    x:250,
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

const s_param = {
    x:0,
    y:250,
    id:4,
    width:500,
    height:50,
    color:'blue',
    css_id:'s',
    gravity_max:20,
    gravity_min:1
}

const m_param = {
    x:400,
    y:0,
    id:2,
    width:50,
    height:50,
    color:'green',
    css_id:'monster',
    gravity_max:20,
    gravity_min:1
}

let game = new Game;

await game.add_frame();
await game.set_entities_list();

let player = new Player(spawn_param.id,spawn_param.x,spawn_param.y);
await player.create_element(spawn_param.height,spawn_param.width,spawn_param.css_id,spawn_param.color);
await player.render_movement();
await player.active_collision();
await player.set_movement(spawn_param.speed_min,spawn_param.speed_max,spawn_param.time_for_max_speed);
await player.active_gravity(spawn_param.gravity_max,spawn_param.gravity_min);
await player.set_jump(spawn_param.jump_height,spawn_param.jump_speed);

let s = new Structure(s_param.id,s_param.x,s_param.y);
await s.create_element(s_param.height,s_param.width,s_param.css_id,s_param.color)
await s.render_movement();
await s.active_collision();
// await s.active_gravity(s_param.gravity_max,s_param.gravity_min);

let structure = new Structure(9,500,100);
await structure.create_element(s_param.height,700,'plateforme','violet')
await structure.render_movement();
await structure.active_collision();
// await structure.active_gravity(s_param.gravity_max,s_param.gravity_min);

let m = new Monster(m_param.id,m_param.x,m_param.y);
await m.create_element(m_param.height,m_param.width,m_param.css_id,m_param.color);
await m.render_movement();
await m.active_collision();
await m.active_gravity(m_param.gravity_max,m_param.gravity_min);

m.move(200,1,'left');



const alive = setInterval(async()=>{

    let collapse = await detect_collapse_all_entities(player,globalVar);
    
    if (collapse) {
        if((collapse.direction === "up" && collapse.entitie.type === "structure" && collapse.entitie.is_faliing) || collapse.entitie.type === "monster")
        {    
            player.die();
            clearInterval(alive);
        }
    }

},10)

// s.move(200,1,'right');
//     setTimeout(()=>{
//         s.move(200,1,'left');
//     },3000)

// setInterval( ()=>{
    
//     s.move(200,1,'right');
//     setTimeout(()=>{
//         s.move(200,1,'left');
//     },3000)


// },6000)

console.log(globalVar)

addEventListener("keydown", async (e)=>{
    if (e.key === "t"){
    await game.clear_frame();
    console.log(globalVar)
};
})
