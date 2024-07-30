"use strict";

import { render_movement } from "./movement.js";
import { collision } from "./movement.js";
import move from "./movement.js";

export default class Player {

    constructor(speed = 10, x = 0, y = 0,) {
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
    }

    create_player_element(frame,heigth=50,width=50) {

        this.width = width;
        this.heigth = heigth;

        const player_box = document.createElement("div");
        player_box.id = "player";
        player_box.style.width = `${this.width}px`;
        player_box.style.height = `${this.heigth}px`;
        player_box.style.position = "absolute";
        player_box.style.backgroundColor = `red`;
        player_box.style.left = `${this.x}px`;
        player_box.style.bottom = `${this.y}px`;

        frame.append(player_box);
    }

    set_player_movement(entities){
        
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
    
        this.movable = setInterval(()=>{
            if(key_pressed.right && !this.touch_right){
                let new_co = move('right',this);
                this.x = new_co.x;
                this.y = new_co.y;
                entities.player.x = new_co.x; 
                entities.player.y = new_co.y;
            } 
            if(key_pressed.left && !this.touch_left){
                let new_co = move('left',this);
                this.x = new_co.x;
                this.y = new_co.y;
                entities.player.x = new_co.x; 
                entities.player.y = new_co.y;
            } 

            

        },10)
    }

    render_player_movement(element){
        this.movement_rendering = setInterval(()=>{
            render_movement(this,element);
        },10)
        
    }

    active_collision(entities){
        this.collision_active = setInterval(()=>{

            collision(this,entities);

        },10)
        
    }
}