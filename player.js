"use strict";

import { fix_collision, gravity, immobilise, move_test } from "./movement.js";
import { render_movement } from "./movement.js";
import { check_collision_all_entities } from "./movement.js";
import move from "./movement.js";

export default class Player {

    constructor(id, x = 0, y = 0,) {
        this.id = id,
        this.x = x,
        this.y = y,
        this.is_jumping = false,
        this.is_falling = false,
        this.collision_active = false,
        this.movement_rendering = false,
        this.movable = false,
        this.test = false,
        this.type = 'player',
        this.direction = null,
        this.is_mooving = false,
        this.immobilised = false
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
    async set_player_movement(speed_min,speed_max,entities,time_for_max_speed = 1000){
        
        this.speed = speed_min;
        this.speed_min = speed_min;
        this.speed_max = speed_max;
        this.time_for_max_speed = time_for_max_speed;
        this.acceleration = (this.speed_max - this.speed_min)/this.time_for_max_speed*10;// division par 10 car setinterval de 10 miliisecondes

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

            

            if (!key_pressed.left && !key_pressed.right && !this.is_jumping && !this.is_falling)
            {
                this.is_mooving = false;
                
            }

            if(key_pressed.right && !this.immobilised){
                
                if (this.direction === "right" && this.is_mooving)
                {
                    if (!this.is_jumping && !this.is_falling)
                    {
                        this.speed += this.acceleration;

                        if (this.speed >= this.speed_max) this.speed = this.speed_max;

                    }
                }
                else if (this.is_falling || this.is_jumping)
                {
                }
                else{

                    this.direction = "right";
                    this.speed = this.speed_min;
                    
                }

                if (this.speed >= this.width)
                {
                    let parts = this.speed/this.width+1
                    let temp_speed = this.speed/parts;


                    for (let i = 0; i < parts; i++)
                    {
                        await move_test('right', this, temp_speed)

                        if (this.collision_active)
                        {
                            let collision = await check_collision_all_entities(this, entities);

                            if(collision){
                                
                                await move_test('left', this, temp_speed);
                                await fix_collision(this, entities, 'right');

                            }

                        }
                    }
                }
                
                else {

                    await move('right', this)

                    if (this.collision_active)
                    {
                        let collision = await check_collision_all_entities(this, entities);
    
                        if(collision){
                            
                            await move('left', this);
                            await fix_collision(this, entities, 'right');
    
                        }
    
                    }
                }

                this.is_mooving = true;

                let index = entities.findIndex((e)=>e.id === this.id);
                entities[index] = this;
                
                    
            } 

            if(key_pressed.left && !this.immobilised){

                if (this.direction === "left" && this.is_mooving)
                {
                    if (!this.is_jumping && !this.is_falling)
                    {
                        this.speed += this.acceleration;

                        if (this.speed >= this.speed_max) this.speed = this.speed_max;

                    }
                    
                }
                else if (this.is_falling || this.is_jumping)
                {
                    
                }
                else{

                    this.direction = "left";
                    this.speed = this.speed_min;
                }

                if (this.speed >= this.width)
                {
                    let parts = this.speed/this.width+1
                    let temp_speed = this.speed/parts;


                    for (let i = 0; i < parts; i++)
                    {
                        await move_test('left', this, temp_speed)

                        if (this.collision_active)
                        {
                            let collision = await check_collision_all_entities(this, entities);

                            if(collision){
                                
                                await move_test('right', this, temp_speed);
                                await fix_collision(this, entities, 'left');

                            }

                        }
                    }
                }

                else {

                    await move('left', this)

                    if (this.collision_active)
                    {
                        let collision = await check_collision_all_entities(this, entities)

                        if(collision){
                            
                            await move('right', this);
                            await fix_collision(this, entities, 'left');

                        }
                    }
                }
    
                

                this.is_mooving = true;

                entities[entities.findIndex((e)=>e.id === this.id)] = this;

                
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
    async active_gravity(force_max,force_min,entities){

        this.gravity_force_max = force_max;
        this.gravity_force_min = force_min; // MUST BE OVER 1
        this.gravity_force = this.gravity_force_min;
        this.gravity_acceleration = (force_max-force_min)/100
        
        this.gravity_active = setInterval( async ()=>{
            if (!this.is_jumping)
            {
                
                await gravity(this, this.gravity_force);
                

                if (this.collision_active)
                {
                    let collision = await check_collision_all_entities(this, entities);

                    if(collision){
                        
                        this.y = collision.height_co+1;
                        
                        if(this.is_falling)await immobilise(this,50);
                        // await move_test('up', this, this.gravity_force);
                        // await fix_collision(this, entities, 'down');
                        this.is_falling = false;
                        this.gravity_force = this.gravity_force_min;
                    }
                    else {
        
                        this.is_falling = true;
                        this.is_mooving = true;
                        this.gravity_force+= this.gravity_acceleration;

                        if(this.gravity_force > this.gravity_force_max) this.gravity_force = this.gravity_force_max;

                    }

                }
                
                entities[entities.findIndex((e)=>e.id === this.id)] = this;
                
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
        this.jump_initial_speed = speed;

        addEventListener('keydown', (e => {
            if (e.key === " " && !this.is_jumping && !this.is_falling) {

                const progress_max = 0.95;
                const start_point = this.y

                this.is_jumping = true;
                this.jump_point = this.y + this.jump_height;
                


                let jump = setInterval(async () => {

                    this.is_mooving = true;
                    
                    if (this.y >= this.jump_point)
                    {
                        this.y = this.jump_point;
                        entities[entities.findIndex((e)=>e.id === this.id)] = this;

                        this.is_jumping = false;
                        this.is_falling = true;
                        clearInterval(jump);
                    }

                    
                    let progress = (this.y-start_point) / this.jump_height < progress_max ? (this.y-start_point) / this.jump_height : progress_max;
                    
                    this.jump_speed = this.jump_initial_speed * (1 - progress);
                    
                    await move_test('up', this, this.jump_speed);

                    if (this.collision_active)
                    {
                        let collision = await check_collision_all_entities(this, entities);
    
                        if(collision){
                            
                            await move_test('down', this, this.jump_speed);
                            await fix_collision(this, entities, 'up');
                            entities[entities.findIndex((e)=>e.id === this.id)] = this;
                            this.is_jumping = false;
                            this.is_falling = true;
                            clearInterval(jump);
                        }
    
                    }
                    
                    entities[entities.findIndex((e)=>e.id === this.id)] = this;

                },10)
            }
        }))


    }

}