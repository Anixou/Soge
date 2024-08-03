"use strict";

export default async function move(direction,target){

    if (direction === 'right')
    {
        target.x = target.x + target.speed;
    }
    else if (direction === 'left')
    {
        target.x = target.x - target.speed;
    }
    else if (direction === 'up')
    {
        target.y = target.y + target.speed;
    }
    else if (direction === 'down')
    {
        target.y = target.y - target.speed;
    }

    target.width_co = target.x + target.width-1;
    target.heigth_co = target.y + target.heigth-1;

}

// async function check_collision_ground(target, entities){

export async function move_test(direction, target, speed = 1){
    
    if (direction === 'right')
    {
        target.x = target.x + speed;
    }
    else if (direction === 'left')
    {
        target.x = target.x - speed;
    }
    else if (direction === 'up')
    {
        target.y = target.y + speed;
    }
    else if (direction === 'down')
    {
        target.y = target.y - speed;
    }

    target.width_co = target.x + target.width-1;
    target.heigth_co = target.y + target.heigth-1;
}

export function render_movement(target){

    let element = document.getElementById(target.css_id);

    element.style.left = target.x+'px';
    element.style.bottom = target.y+'px';
}

export async function check_collision(target, entitie){

    if (target.x > entitie.width_co || target.y > entitie.height_co || target.width_co < entitie.x || target.height_co < entitie.y)
        return false;
    else return true;

}

export async function check_collision_all_entities(target,entities)
{
    for (let i = 0; i < entities.length; i++)
    {
        if (entities[i].id!= target.id && await check_collision(target, entities[i]))
            return entities[i];
    }
    return false;
}

export async function fix_collision(target, entities, direction) {
    let opposite;

    if (direction === 'right') opposite = 'left';
    if (direction === 'left') opposite = 'right';

    for (let speed = 1; speed <= target.speed; speed++) {
        
        await move_test(direction, target);
        const collision = await check_collision_all_entities(target, entities);

        if (collision) {

            if (speed > 1) {
                await move_test(opposite, target);
                return;
            }
        } 
    }

}

// a voir plus tard si la collision inactive peut poser probleme
export function gravity(entitie, force){

    if (entitie.y > 0) entitie.y -= force;
    
}

export function jump(height){

}
