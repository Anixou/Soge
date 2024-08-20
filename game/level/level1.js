import Player from "../../engine/class/player.js";
import Game from "../../engine/class/game.js";
import Structure from "../../engine/class/structure.js";
import Monster from "../../engine/class/monster.js";
import { detect_collapse } from "../../engine/modele/movement.js";

export default async function level1(game)
{

    
    const player_param = {
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

    const structure_param = {
        x:50,
        y:120,
        id:2,
        width:30,
        height:50,
        color:'blue',
        css_id:'blue',
        gravity_max:10,
        gravity_min:1
    }

    let player = new Player(player_param.id,player_param.x,player_param.y);
    await player.create_element(player_param.height,player_param.width,player_param.css_id,player_param.color);
    await player.render_movement();
    await player.active_collision();
    await player.set_movement(player_param.speed_min,player_param.speed_max,player_param.time_for_max_speed);
    await player.active_gravity(player_param.gravity_max,player_param.gravity_min);
    await player.set_jump(player_param.jump_height,player_param.jump_speed);

    let structure_blue = new Structure(structure_param.id,structure_param.x,structure_param.y,"%");
    await structure_blue.create_element(structure_param.height,structure_param.width,structure_param.css_id,structure_param.color,"px","%");
    await structure_blue.render_movement();
    await structure_blue.active_collision();

    let structure_green = new Structure(3,25,300,"%");
    await structure_green.create_element(structure_param.height,30,'green','green',null,"%");
    await structure_green.render_movement();
    await structure_green.active_collision();

    let structure_pink = new Structure(4,60,500,'%');
    await structure_pink.create_element(structure_param.height,700,'pink','pink');
    await structure_pink.render_movement();
    await structure_pink.active_collision();

    let finish = new Structure(5,95,100,'%');
    await finish.create_element(structure_param.height,3,'yellow','yellow',null,'%');
    await finish.render_movement();
    await finish.active_collision();

    let win = setInterval(async ()=>{

        if (await detect_collapse(player, finish) === 'down')
        {
            game.win = true;
            clearInterval(win);
            return;
        }
    },10)

}
