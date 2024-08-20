"use strict";

//mouvement basique prenant en compte la vitesse du joueur

/**
 * Moves the target element in the specified direction by its speed.
 * @param {string} direction - The direction to move ('right', 'left', 'up', or 'down').
 * @param {Object} target - The target object to be moved.
 * @returns {Promise<void>} - A promise that resolves when the movement is complete.
 */

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

/**
 * Moves the target element in the specified direction by a fixed speed.
 * @param {string} direction - The direction to move ('right', 'left', 'up', or 'down').
 * @param {Object} target - The target object to be moved.
 * @returns {Promise<void>} - A promise that resolves when the movement is complete.
 */

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

/**
 * Updates the position of the target element in the HTML document.
 * @param {Object} target - The target object to be rendered.
 * @returns {void}
 */

export function render_movement(target){

    let element = document.getElementById(target.css_id);

    element.style.left = target.x+'px';
    element.style.bottom = target.y+'px';
}

/**
 * Checks if there is a collision between the target and another entity.
 * @param {Object} target - The target object to check for collision.
 * @param {Object} entitie - The entity object to check for collision.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if there is a collision, otherwise `false`.
 */

export async function check_collision(target, entitie){

    if (target.x > entitie.width_co || target.y > entitie.height_co || target.width_co < entitie.x || target.height_co < entitie.y || !entitie.collision_active || !entitie.alive)
        return false;
    else return true;

}

/**
 * Checks for collisions between the target and all other entities.
 * @param {Object} target - The target object to check for collisions.
 * @param {Array<Object>} entities - The list of all entities to check against.
 * @returns {Promise<Object|boolean>} - A promise that resolves to the first entity that collides with the target, or `false` if no collision is detected.
 */

export async function check_collision_all_entities(target,entities)
{
    
    for (let i = 0; i < entities.length; i++)
    {
        if (entities[i].id!= target.id && await check_collision(target, entities[i]) && !target.collision_exceptions.some(e=>e.id===entities[i].id))
            return entities[i];
    }
    return false;
}

/**
 * Corrects a collision by moving the target away from all other entities.
 * @param {Object} target - The target object to correct collisions for.
 * @param {Array<Object>} entities - The list of all entities to check against.
 * @param {string} direction - The direction of the movement causing the collision.
 * @param {number} speed_context - The maximum speed to use for collision correction.
 * @returns {Promise<void>} - A promise that resolves when the collision correction is complete.
 */

export async function fix_collision(target, entities, direction,speed_context) {
    let opposite;

    if (direction === 'right') opposite = 'left';
    if (direction === 'left') opposite = 'right';
    if (direction === 'up') opposite = 'down';
    if (direction === 'down') opposite = 'up';

    for (let speed = 1; speed <= speed_context; speed++) {
        
        await move_test(direction, target);
        const collision = await check_collision_all_entities(target, entities);

        if (collision) {

            await move_test(opposite, target);
            return;
        } 
    }

}

/**
 * Applies gravity to the target, affecting its vertical position.
 * @param {Object} entitie - The entity to apply gravity to.
 * @param {number} force - The amount of gravity to apply.
 * @returns {Promise<void>} - A promise that resolves when gravity has been applied.
 */
export async function gravity(entitie, force){

    entitie.y -= force;
    entitie.height_co = entitie.y +entitie.height-1
    
}

/**
 * Immobilizes the target for a specified amount of time.
 * @param {Object} target - The target object to immobilize.
 * @param {number} time - The duration to keep the target immobilized in milliseconds.
 * @returns {Promise<void>} - A promise that resolves when the immobilization is complete.
 */

export async function immobilise(target,time)
{
    target.immobilised = true;
    target.is_mooving = false;

    setTimeout(() =>{
        target.immobilised = false;
    },time)
}

/**
 * Detects a collapse between the target and another entity, determining the direction of overlap.
 * @param {Object} target - The target object to check for collapse.
 * @param {Object} entitie - The entity object to check against.
 * @returns {Promise<string|boolean>} - A promise that resolves to the direction of the collapse ("left", "right", "up", "down") or `false` if no collapse is detected.
 */

export async function detect_collapse(target, entitie) {
    // Vérification de la collision sur l'axe X
    const collisionX = target.x <= entitie.width_co+1 && target.width_co >= entitie.x-1 && entitie.alive;

    // Vérification de la collision sur l'axe Y
    const collisionY = target.y <= entitie.height_co+1 && target.height_co >= entitie.y-1 && entitie.alive;

    if (collisionX && collisionY) {
        // Déterminer le côté de la collision
        const overlapRight = target.width_co - entitie.x;
        const overlapLeft = entitie.width_co - target.x;
        const overlapTop = target.height_co - entitie.y;
        const overlapBottom = entitie.height_co - target.y;

        const smallestOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (smallestOverlap === overlapLeft) return "left";
        if (smallestOverlap === overlapRight) return "right";
        if (smallestOverlap === overlapTop) return "up";
        if (smallestOverlap === overlapBottom) return "down";
    }

    return false; // Pas de collision
}

/**
 * Detects collapses between the target and all other entities, returning the direction of each collapse.
 * @param {Object} target - The target object to check for collapses.
 * @param {Array<Object>} entities - The list of all entities to check against.
 * @returns {Promise<Array<Object>|boolean>} - A promise that resolves to an array of objects containing the direction and the entity involved in each collapse, or `false` if no collapses are detected.
 */

export async function detect_collapse_all_entities(target,entities)
{
    let collapsed = [];

    for (let i = 0; i < entities.length; i++)
    {
        if (entities[i].id!= target.id && entities[i].type != 'world' && entities[i].collision_active && await detect_collapse(target, entities[i]))
        {
            collapsed.push({direction : await detect_collapse(target,entities[i]), entitie : entities[i]});
        }
    }

    if(collapsed.length>0) return collapsed;
    else return false;

}