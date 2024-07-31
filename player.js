"use strict";

import { gravity } from "./movement.js";
import { render_movement } from "./movement.js";
import { collision } from "./movement.js";
import move from "./movement.js";

export default class Player {

    constructor(id,speed = 10, x = 0, y = 0,) {
        this.id = id,
        this.speed = speed,
        this.x = x,
        this.y = y,
        this.touch_down = false,
        this.touch_up = false,
        this.touch_left = false,
        this.touch_right = false,
        this.is_falling = false,
        this.is_jumping = false,
        this.collision_active = false,
        this.movement_rendering = false,
        this.movable = false
        this.test = false;
        this.type = 'player';
    }

    async create_player_element(frame,heigth=50,width=50,id="player",color) {

        this.width = width-1;
        this.heigth = heigth-1;

        const player_box = document.createElement("div");
        player_box.id = id;
        player_box.style.width = `${this.width}px`;
        player_box.style.height = `${this.heigth}px`;
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
            if(key_pressed.right && !this.touch_right){
                await move('right', this)
                .then(()=>{
                    let index = entities.findIndex((e)=>e.id === this.id);
                    entities[index] = this;
                });
                
            } 
            if(key_pressed.left && !this.touch_left){
                await move('left', this)
                .then(()=>{
                    let index = entities.findIndex((e)=>e.id === this.id);
                    entities[index] = this;
                });
            } 

            

        },10)
    }

    async render_player_movement(element){
        this.movement_rendering = setInterval(()=>{
            render_movement(this,element);
        },10)
        
    }

    async active_collision(entities){
        this.collision_active = setInterval(()=>{

            collision(this,entities);

        },10)
        
    }

    async unset_player_movement(){
        clearInterval(this.movable);
        this.movable = false;
    }

    async active_gravity(force){
        this.gravity_active = setInterval(()=>{
            if (!this.is_jumping && !this.touch_down)
            {
                gravity(this, force);
            }
        },100)
    }

}