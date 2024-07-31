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

}

export function render_movement(target, element){

    element.style.left = target.x+'px';
    element.style.bottom = target.y+'px';
}

export function collision(target, entities){

    let touch_left = false;
    let touch_right = false;
    let touch_up = false;
    let touch_down = false;
    let x = target.x;
    let y = target.y;

    if(target.x <= 0){

        touch_left = true
        x = 0;
    }

    if(target.x >= window.innerWidth-target.width){

        touch_right = true;
        x = window.innerWidth-target.width
    }

    if(target.y <= 0){

        touch_down = true;
        y = 0;
    }
    
    if(target.y >= window.innerHeight-target.heigth){
        
        touch_up = true;
        y = window.innerHeight-target.heigth
    }

    entities.forEach(entitie => {
        if (target.id < entitie.id)
        {
            if (target.x + target.width > entitie.x && target.x + target.width < entitie.x+entitie.width && target.y >= entitie.y && target.y < entitie.y+entitie.heigth && entitie.collision_active)
        {
            touch_right = true;
            x = entitie.x-target.width-1;
        }

        if (target.x > entitie.x && target.x < entitie.x+entitie.width && target.y >= entitie.y && target.y < entitie.y+entitie.heigth && entitie.collision_active)
        {
            touch_left = true;
            x = entitie.x+entitie.width+1;
        }

        if (target.y + target.heigth >= entitie.y && target.y + target.heigth < entitie.y+entitie.heigth && target.x >= entitie.x && target.x <= entitie.x+entitie.width && entitie.collision_active)
        {
            touch_up = true;
            y = entitie.y-target.heigth-1;
        }

        if (target.y > entitie.y && target.y <= entitie.y+entitie.heigth && target.x >= entitie.x && target.x <= entitie.x+entitie.width && entitie.collision_active)
        {
            touch_down = true;
            y = entitie.y+entitie.heigth;
            if (target.test === false)
                {
                    target.test = true;
                    console.log(target);
                }

        }
        }
        
    
        
    });

    target.x = x;
    target.y = y;
    target.touch_down = touch_down;
    target.touch_up = touch_up;
    target.touch_left = touch_left;
    target.touch_right = touch_right;
}

// a voir plus tard si la collision inactive peut poser probleme
export function gravity(entitie, force){

    if (entitie.y > 0) entitie.y -= force;
    
}

export function jump(height){

}