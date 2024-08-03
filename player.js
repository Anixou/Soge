"use strict";

import { fix_collision, gravity, move_test } from "./movement.js";
import { render_movement } from "./movement.js";
import { check_collision } from "./movement.js";
import { check_collision_all_entities } from "./movement.js";
import move from "./movement.js";

export default class Player {

    constructor(id,speed = 10, x = 0, y = 0,) {
        this.id = id,
        this.speed = speed,
        this.x = x,
        this.y = y,
        this.is_falling = false,
        this.is_jumping = false,
        this.collision_active = false,
        this.movement_rendering = false,
        this.movable = false
        this.test = false;
        this.type = 'player';
    }

    async create_player_element(frame,height=50,width=50,id="player",color='red') {

        this.width = width;
        this.height = height;

        this.width_co = this.x + width-1;
        this.height_co = this.y + height-1;

        this.css_id = id;

        const player_box = document.createElement("div");
        player_box.id = id;
        player_box.style.width = `${this.width}px`;
        player_box.style.height = `${this.height}px`;
        player_box.style.position = "absolute";
        player_box.style.backgroundColor = color;
        player_box.style.left = `${this.x}px`;
        player_box.style.bottom = `${this.y}px`;

        frame.append(player_box);
    }

    async set_player_movement(entities){
        
        let key_pressed = {
            up : false,
            down : false,
            left : false,
            right : false
        }

        addEventListener("keydown", (e)=> {
    
            if (e.key === "ArrowRight")key_pressed.right = true;
            if (e.key === "ArrowLeft")key_pressed.left = true;
            if (e.key === "ArrowUp")key_pressed.up = true;
            if (e.key === "ArrowDown")key_pressed.down = true;
        });
    
        addEventListener("keyup", (e)=> {
            if (e.key === "ArrowRight")key_pressed.right = false;
            if (e.key === "ArrowLeft")key_pressed.left = false;
            if (e.key === "ArrowUp")key_pressed.up = false;
            if (e.key === "ArrowDown")key_pressed.down = false;
        });
    
        this.movable = setInterval(async ()=>{
            if(key_pressed.right){

                await move('right', this)

                if (this.collision_active)
                {
                    let collision = await check_collision_all_entities(this, entities);

                    if(collision){
                        
                        await move('left', this);
                        await fix_collision(this, entities, 'right');

                    }

                    let index = entities.findIndex((e)=>e.id === this.id);
                    entities[index] = this;
                }

                let index = entities.findIndex((e)=>e.id === this.id);
                entities[index] = this;
                
                    
            } 
            if(key_pressed.left){

                await move('left', this)

                if (this.collision_active)
                {
                    let collision = await check_collision_all_entities(this, entities)

                    if(collision){
                        
                        await move('right', this);
                        await fix_collision(this, entities, 'left');

                    }
                }

                let index = entities.findIndex((e)=>e.id === this.id);
                entities[index] = this;
                
            } 

            
            render_movement(this);

        },10)
    }

    async render_player_movement(){
        this.movement_rendering = true;
        
    }

    active_collision(){
        this.collision_active = true;
    }

    async unset_player_movement(){
        clearInterval(this.movable);
        this.movable = false;
    }

    async active_gravity(force,entities){
        this.gravity_active = setInterval( async ()=>{
            if (!this.is_jumping)
            {
                console.log(this.y);
                gravity(this, force);

                if (this.collision_active)
                    {
                        let collision = await check_collision_all_entities(this, entities);
    
                        if(collision){
                            
                            await move_test('top', this, force);
                            await fix_collision(this, entities, 'down');
    
                        }
    
                        let index = entities.findIndex((e)=>e.id === this.id);
                        entities[index] = this;
    
                    }
                    
                    let index = entities.findIndex((e)=>e.id === this.id);
                    entities[index] = this;
                }
            
            render_movement(this);
        },10)
    }

}