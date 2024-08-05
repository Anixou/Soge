"use strict";

//mouvement basique prenant en compte la vitesse du joueur
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
    target.height_co = target.y + target.height-1;

}

//mouvement basique sans prendre en compte la vitesse du joueur pour des deplacements controlés
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
    target.height_co = target.y + target.height-1;
}

//mise a jour de la position de l'element dans la page HTML
export function render_movement(target){

    let element = document.getElementById(target.css_id);

    element.style.left = target.x+'px';
    element.style.bottom = target.y+'px';
}

//verification de la collision entre deux elements
export async function check_collision(target, entitie){

    // console.log(target, entitie)

    if (target.x > entitie.width_co || target.y > entitie.height_co || target.width_co < entitie.x || target.height_co < entitie.y || !entitie.collision_active)
        return false;
    else return true;

}

//verification de la collision entre un element et tous les autres elements
export async function check_collision_all_entities(target,entities)
{
    
    for (let i = 0; i < entities.length; i++)
    {
        if (entities[i].id!= target.id && await check_collision(target, entities[i]))
            return entities[i];
    }
    return false;
}

//correction de la collision entre un element et tous les autres elements
export async function fix_collision(target, entities, direction) {
    let opposite;

    if (direction === 'right') opposite = 'left';
    if (direction === 'left') opposite = 'right';
    if (direction === 'up') opposite = 'down';
    if (direction === 'down') opposite = 'up';

    for (let speed = 1; speed <= target.speed; speed++) {
        
        await move_test(direction, target);
        const collision = await check_collision_all_entities(target, entities);

        if (collision) {

            await move_test(opposite, target);
            return;
        } 
    }

}

// a voir plus tard si la collision inactive peut poser probleme

//gravite du joueur
export async function gravity(entitie, force){

    entitie.y -= force;
    
}

export async function immobilise(target,time)
{
    target.immobilised = true;

    setTimeout(() =>{
        target.immobilised = false;
    },time)
}