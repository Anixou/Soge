"use strict";

import { render_movement } from "./movement.js";
import move from "./movement.js";

export default class Player {

    constructor(speed = 10, x = 0, y = 0) {
        this.speed = speed,
        this.x = x,
        this.y = y,
        this.is_falling = false,
        this.is_jumping = false
    }

    create_player_element(heigth,witdh,frame) {
        const player_box = document.createElement("div");
        player_box.id = "player";
        player_box.style.width = `${witdh}px`;
        player_box.style.height = `${heigth}px`;
        player_box.style.position = "absolute";
        player_box.style.backgroundColor = `red`;
        player_box.style.left = `${this.x}px`;
        player_box.style.bottom = `${this.y}px`;

        frame.append(player_box);
    }

    set_player_movement(element){
        
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
            console.log(e);
        });
    
        addEventListener("keyup", (e)=> {
            if (e.key === "ArrowRight")key_pressed.right = false;
            if (e.key === "ArrowLeft")key_pressed.left = false;
            if (e.key === "ArrowUp")key_pressed.up = false;
            if (e.key === "ArrowDown")key_pressed.down = false;
        });
    
        setInterval(()=>{
            if(key_pressed.right){
                let new_co = move('right',this);
                this.x = new_co[0];
                this.y = new_co[1];
            } 
            if(key_pressed.left){
                let new_co = move('left',this);
                this.x = new_co[0];
                this.y = new_co[1];
            } 
            // if(key_pressed.up) move('up',target,element);
            // if(key_pressed.down) move('down',target,element);
        },10)
    }

    render_player_movement(element){
        setInterval(()=>{
            render_movement(this,element);
        },10)
        
    }
}