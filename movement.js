"use strict";

export default function move(direction,target){

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

    return [target.x,target.y];
    
}

export function render_movement(target, element){

    element.style.left = target.x+'px';
    element.style.bottom = target.y+'px';
}


export function gravity(force){

}

export function jump(height){

}