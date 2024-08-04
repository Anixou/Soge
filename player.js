"use strict";

import { fix_collision, gravity, move_test } from "./movement.js";
import { render_movement } from "./movement.js";
import { check_collision_all_entities } from "./movement.js";
import move from "./movement.js";

export default class Player {

    constructor(id,speed_max = 10, x = 0, y = 0,) {
        this.id = id,
        this.speed = 0,
        this.speed_max = speed_max,
        this.acceleration = 0.1,
        this.x = x,
        this.y = y,
        this.is_jumping = false,
        this.is_falling = false,
        this.collision_active = false,
        this.movement_rendering = false,
        this.movable = false
        this.test = false;
        this.type = 'player';
        this.direction = null;
    }

    //créer l'élément HTML du joueur
    async create_player_element(height=50,width=50,id="player",color='red') {

        this.width = width;
        this.height = height;

        this.width_co = this.x + width-1;
        this.height_co = this.y + height-1;

        this.css_id = id;

        const frame = document.getElementById("frame");

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

    async remove_player_element() {

        try {

            const player_box = document.getElementById(this.css_id);
            player_box.remove();
        } catch (e) {}
        
        this.unset_movement_rendering()
        
    }

    //active les mouvements du joueur, gere l'event listener et la collision
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

                console.log(this.speed);
                

                if (this.direction === "right")
                {
                    if (this.speed < this.speed_max)this.speed += this.acceleration;
                }
                else{

                    this.direction = "right";
                    this.speed = 0;
                }


                await move('right', this)

                if (this.collision_active)
                {
                    let collision = await check_collision_all_entities(this, entities);

                    if(collision){
                        
                        await move('left', this);
                        await fix_collision(this, entities, 'right');

                    }

                }

                let index = entities.findIndex((e)=>e.id === this.id);
                entities[index] = this;
                
                    
            } 
            if(key_pressed.left){

                console.log(this.speed);
                if (this.direction === "left")
                {
                    if (this.speed < this.speed_max)this.speed += this.acceleration;
                    
                }
                else{

                    this.direction = "left";
                    this.speed = 0;
                }
    

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

        },10)
    }


    //desactive les mouvements du joueur
    async unset_player_movement(){
        clearInterval(this.movable);
        this.movable = false;
    }

    
    //active le rendu visuel des mouvements
    async render_player_movement(){
        this.movement_rendering = setInterval( async () => {
            render_movement(this);
        },1);
        
    }

    async unset_movement_rendering(){
        clearInterval(this.movement_rendering);
        this.movement_rendering = false;
    }

    //Active les collision du joueur
    active_collision(){
        this.collision_active = true;
    }

    //desactive les collision du joueur
    async unset_collision(){
        this.collision_active = false;
    }

    //Active la gravité du joueur
    async active_gravity(force,entities){
        this.gravity_active = setInterval( async ()=>{
            if (!this.is_jumping)
            {
                await gravity(this, force);
                
                this.is_falling = true;

                if (this.collision_active)
                {
                    let collision = await check_collision_all_entities(this, entities);

                    if(collision){
                        
                        await move_test('up', this, force);
                        await fix_collision(this, entities, 'down');
                        this.is_falling = false;
                    }

                }
                
                let index = entities.findIndex((e)=>e.id === this.id);
                entities[index] = this;
            }
            
        },10)
    }

    async clear_gravity() {
        clearInterval(this.gravity_active);
        this.gravity_active = false;
    }

    async set_jump(height,speed,entities){

        this.jump_height = height;
        this.jump_speed = speed;

        addEventListener('keydown', (e => {
            if (e.key === " " && !this.is_jumping && !this.is_falling) {

                
                this.is_jumping = true;
                this.jump_point = this.y + this.jump_height;


                let jump = setInterval(async () => {

                    if (this.y >= this.jump_point)
                    {
                        this.y = this.jump_point;
                        let index = entities.findIndex((e)=>e.id === this.id);
                        entities[index] = this;
                        this.is_jumping = false;
                        clearInterval(jump);
                    }

                    await move_test('up', this, this.jump_speed);

                    if (this.collision_active)
                    {
                        let collision = await check_collision_all_entities(this, entities);
    
                        if(collision){
                            
                            await move_test('down', this, this.jump_speed);
                            await fix_collision(this, entities, 'up');
                            let index = entities.findIndex((e)=>e.id === this.id);
                            entities[index] = this;
                            this.is_jumping = false;
                            clearInterval(jump);
                        }
    
                    }
                    
                    let index = entities.findIndex((e)=>e.id === this.id);
                    entities[index] = this;

                },10)
            }
        }))


    }

}