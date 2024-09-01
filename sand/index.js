import Game from "../engine/class/game.js";

let game = new Game();
await game.add_frame();
await game.set_entities_list(); 

import Structure from "../engine/class/structure.js";

export default async function sand()
{

    const structure_param = {
        width:25,
        height:25,
        color:'yellow',
        css_id:'yellow',
        gravity_max:10,
        gravity_min:1
    }

    let mousedown = false;
    let mx;
    let my;

    addEventListener('mousemove', (e)=> {
        mx = e.clientX;
        my = e.clientY;
    })

    addEventListener('mouseup', (e)=> {
        mousedown = false;
    })

    addEventListener('mousedown', (e)=>{
        mousedown = true;
    })

    setInterval((e)=>{
        
        if(mousedown)
        {
            let structure = new Structure(Math.random(), mx, globalVar[1].y - my);
            structure.create_element(structure_param.width, structure_param.height, Math.random(), structure_param.color);
            structure.render_movement();
            structure.active_collision();
            structure.active_gravity(structure_param.gravity_max, structure_param.gravity_min);
        }
    },50)
}

sand();