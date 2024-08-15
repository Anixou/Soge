import Structure from "../../engine/class/structure.js";
import Monster from "../../engine/class/monster.js";
import { detect_collapse } from "../../engine/modele/movement.js";
import init_player from "../../engine/modele/init_player.js";

let win;
export default async function level2(game)
{

    const player_param = {
        x:200,
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
        y:200,
        id:2,
        width:30,
        height:200,
        color:'blue',
        css_id:'blue',
        gravity_max:10,
        gravity_min:1
    }

    const monster_param = {
        x:30,
        y:0,
        id:6,
        width:50,
        height:50,
        color:'purple',
        css_id:'monster',
        gravity_max:20,
        gravity_min:1,
        speed : 3
    }

    let player = await init_player(player_param);

    let structure_blue = new Structure(structure_param.id,structure_param.x,structure_param.y,"%");
    await structure_blue.create_element(structure_param.height,structure_param.width,structure_param.css_id,structure_param.color,"px","%");
    await structure_blue.render_movement();
    await structure_blue.active_collision();

    let structure_green = new Structure(3,25,300,"%");
    await structure_green.create_element(50,20,'green','green',null,"%");
    await structure_green.render_movement();
    await structure_green.active_collision();


    let finish = new Structure(5,95,100,'%');
    await finish.create_element(50,3,'yellow','yellow',null,'%');
    await finish.render_movement();
    await finish.active_collision();

    let monster = new Monster(monster_param.id,monster_param.x,800,'%');
    await monster.create_element(monster_param.height,monster_param.width,monster_param.css_id,monster_param.color);
    await monster.render_movement();
    await monster.active_collision();
    await monster.active_gravity(monster_param.gravity_max,monster_param.gravity_min);
    
    await monster.track_player(player,monster_param.speed);



    structure_blue.move(200,1,'down');
        setTimeout(()=>{
            structure_blue.move(200,1,'up');
        },3000)

    setInterval( ()=>{
        
        structure_blue.move(200,1,'down');
        setTimeout(()=>{
            structure_blue.move(200,1,'up');
        },3000)


    },6000)



    
    let result = setInterval(async ()=>{

        if (await detect_collapse(player, finish) === 'down')
        {
            game.win = true;
            clearInterval(result);
        }
        else if (await detect_collapse(player, monster) || await detect_collapse(player, structure_blue)=== 'up')
        {
            game.lose = true;
            player.die()
            clearInterval(result);
        }

    },10)
}