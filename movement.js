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

    return {x:target.x , y:target.y};
    
}

export function render_movement(target, element){

    element.style.left = target.x+'px';
    element.style.bottom = target.y+'px';
}

export function collision(target, entities){

    if(target.x <= 0){

        target.touch_left = true
        target.x = 0;
    }
    else target.touch_left = false;

    if(target.x >= window.innerWidth-target.width){

        target.touch_right = true;
        target.x = window.innerWidth-target.width
    }
    else target.touch_right = false;

    if(target.y <= 0){

        target.touch_down = true;
        target.y = 0;
    }
    else target.touch_down = false;
    
    if(target.y >= window.innerHeight-target.heigth){
        
        target.touch_up = true;
        target.y = window.innerHeight-target.heigth
    }
    else target.touch_up = false;
}


export function gravity(force){

}

export function jump(height){

}