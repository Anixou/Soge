"use strict";

import { detect_collapse,detect_collapse_all_entities, fix_collision, gravity, immobilise, move_test } from "../modele/movement.js";
import { render_movement } from "../modele/movement.js";
import { check_collision_all_entities } from "../modele/movement.js";
import move from "../modele/movement.js";

/**
 * @class Player
 * @classdesc Represents a player in the game. Handles the player's properties, movements, collisions, and other actions.
 */

export default class Player {

    /**
     * Creates an instance of Player.
     * @param {string | number} id - The unique identifier for the player.
     * @param {number} [x=0] - The initial x-coordinate position.
     * @param {number} [y=0] - The initial y-coordinate position.
     * @param {string} [x_mesure='px'] - The unit of measurement for the x-coordinate ('px' or '%').
     * @param {string} [y_mesure='px'] - The unit of measurement for the y-coordinate ('px' or '%').
     */

    constructor(id, x = 0, y = 0,x_mesure = 'px', y_mesure = 'px') {

        if (x_mesure === '%') {
            this.x = Math.floor(x * window.innerWidth / 100);
        }
        else {
            this.x = x;
        }

        if (y_mesure === '%') {
            this.y = Math.floor(y * window.innerHeight / 100);
        }
        else {
            
            this.y = y;
        }
        this.id = id;
        this.alive = true;
        this.is_jumping = false;
        this.is_falling = false;
        this.may_fall = false;
        this.collision_active = false;
        this.movement_rendering = false;
        this.movable = false;
        this.type = 'player';
        this.direction = null;
        this.is_mooving = false;
        this.immobilised = false;
        this.immobilise_on_fall = true;
        this.immobilise_time = 50;
        this.collision_exceptions = [];

        globalVar.push(this)
    }

    /**
     * Saves the current state of the player in the global variables.
     * @async
     * @returns {Promise<void>}
     */
    async save() {
        globalVar[globalVar.findIndex((e)=>e.id === this.id)] = this;
    }

    /**
     * Creates the player's HTML element and appends it to the DOM.
     * @async
     * @param {number} [height=50] - The height of the player's element.
     * @param {number} [width=50] - The width of the player's element.
     * @param {string} id - The HTML id for the player's element.
     * @param {string} [color='red'] - The color of the player's element.
     * @param {string} [height_mesure='px'] - The unit for the height ('px' or '%').
     * @param {string} [width_mesure='px'] - The unit for the width ('px' or '%').
     * @returns {Promise<void>}
     */
    async create_element(height=50,width=50,id,color='red',height_mesure = 'px', width_mesure = 'px') {

        if (height_mesure === '%')
        {
            this.height = Math.floor(height * window.innerHeight / 100);
        }
        else 
        {
            this.height = height;
        }

        if (width_mesure === '%')
        {
            this.width = Math.floor(width * window.innerWidth / 100);
        }
        else
        {
            this.width = width;
        }

        this.width_co = this.x + this.width-1;
        this.height_co = this.y + this.height-1;

        this.css_id = id;
        this.color = color;

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

    /**
     * Removes the player's HTML element from the DOM.
     * @async
     * @returns {Promise<void>}
     */
    async remove_element() {//A REVOIR

        new Promise((resolve, reject) => {
            try {

                const player_box = document.getElementById(this.css_id);
                player_box.remove();

            } catch (e) {reject()}

            this.unset_movement_rendering();
            resolve();

        })
        
        
        
    }

    /**
     * Activates the player's movement and handles keypress events for movement control.
     * @async
     * @param {number} speed_min - The minimum speed of the player.
     * @param {number} speed_max - The maximum speed of the player.
     * @param {number} [time_for_max_speed=1000] - Time in milliseconds to reach maximum speed.
     * @returns {Promise<void>}
     */
    //active les mouvements du joueur, gere l'event listener et la collision
    async set_movement(speed_min,speed_max,time_for_max_speed = 1000){
        
        let entities = window.globalVar
        this.speed = speed_min;
        this.speed_min = speed_min;
        this.speed_max = speed_max;
        this.time_for_max_speed = time_for_max_speed;
        this.acceleration = (this.speed_max - this.speed_min)/this.time_for_max_speed*10;// fois 10 car setinterval de 10 miliisecondes

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
                    this.speed = this.speed_min;
                    
                }
    
                if(key_pressed.right && !this.immobilised){

                    let collapse_test =  await detect_collapse_all_entities(this, globalVar);

                    if (collapse_test && collapse_test.some(e => e.direction === 'right'))
                        return;
                    
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
                                    await fix_collision(this, entities, 'right',this.speed);
    
                                }
    
                            }
                        }
                    }
                    
                    else {
    
                        await move('right', this);
                        
    
                        if (this.collision_active)
                        {
                            let collision = await check_collision_all_entities(this, entities);
        
                            if(collision && await detect_collapse(this, collision) === 'right'){
                                await move('left', this);
                                await fix_collision(this, entities, 'right',this.speed);
        
                            }
        
                        }
                    }
    
                    this.is_mooving = true;
    
                    let index = entities.findIndex((e)=>e.id === this.id);
                    entities[index] = this;
                    
                        
                } 
    
                if(key_pressed.left && !this.immobilised){

                    let collapse_test =  await detect_collapse_all_entities(this, globalVar);

                    if (collapse_test && collapse_test.some(e => e.direction === 'left'))
                        return;
    
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
                                    await fix_collision(this, entities, 'left',this.speed);
    
                                }
    
                            }
                        }
                    }
    
                    else {
    
                        await move('left', this)
    
                        if (this.collision_active)
                        {
                            let collision = await check_collision_all_entities(this, entities)
    
                            if(collision && await detect_collapse(this, collision) === 'left'){
                                
                                await move('right', this);
                                await fix_collision(this, entities, 'left',this.speed);
    
                            }
                        }
                    }
    
                    this.is_mooving = true;
    
                    entities[entities.findIndex((e)=>e.id === this.id)] = this;
                } 
    
            },10)
    }


    /**
     * Deactivates the player's movement.
     * @async
     * @returns {Promise<void>}
     */    
    async unset_movement(){
        clearInterval(this.movable);
        this.movable = false;
    }

    
    /**
     * Activates the visual rendering of the player's movements.
     * @async
     * @returns {Promise<void>}
     */
    async render_movement(){
        this.movement_rendering = setInterval( async () => {
            render_movement(this);
        },1);
        
    }

    /**
     * Deactivates the visual rendering of the player's movements.
     * @async
     * @returns {Promise<void>}
     */
    async unset_movement_rendering(){
        clearInterval(this.movement_rendering);
        this.movement_rendering = false;
    }

    /**
     * Activates collision detection for the player.
     * @async
     * @returns {Promise<void>}
     */
    async active_collision(){
        this.collision_active = setInterval( async () => {
            const collapse = await detect_collapse_all_entities(this,globalVar);

            if (collapse)
            {
                let collapse_right = collapse.find(e => {if(e.direction === 'right') return e})
                let collapse_left = collapse.find(e => {if(e.direction === 'left') return e})
                let collapse_down = collapse.find(e => {if(e.direction === 'down') return e})

                if (collapse_right)
                {
                    this.x = collapse_right.entitie.x-this.width;
                    this.width_co = this.x + this.width-1;
                }
                if (collapse_left)
                {
                    this.x = collapse_left.entitie.width_co+1;
                    this.width_co = this.x + this.width-1;
                }
                if (collapse_down)
                {
                this.y = collapse_down.entitie.y+collapse_down.entitie.height;
                this.height_co = this.y + this.height-1;
                }
            }
            
            
            this.save();
        }, 10);
    }

    /**
     * Deactivates collision detection for the player.
     * @async
     * @returns {Promise<void>}
     */
    async unset_collision(){
        clearInterval(this.collision_active);
        this.collision_active = false;
    }

    /**
     * Activates gravity effects on the player.
     * @async
     * @param {number} force_max - The maximum force of gravity.
     * @param {number} force_min - The minimum force of gravity.
     * @returns {Promise<void>}
     */
    async active_gravity(force_max,force_min){

        let entities = globalVar
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

                    if(collision && await detect_collapse(this, collision) === 'down'){
                        
                        this.y = collision.height_co+1;
                        this.height_co = this.y + this.height-1;
                        
                        if (this.immobilise_on_fall && this.gravity_force >= this.gravity_force_max/4)
                        {
                            if(this.is_falling)await immobilise(this,this.immobilise_time);
                        }
                        // await move_test('up', this, this.gravity_force);
                        // await fix_collision(this, entities, 'down');
                        this.is_falling = false;
                        this.may_fall = false;
                        this.gravity_force = this.gravity_force_min;
                    }
                    else {
        
                        if(this.may_fall)this.is_falling = true;
                        else this.may_fall = true;
                        this.is_mooving = true;
                        this.gravity_force+= this.gravity_acceleration;
                        
                        if(this.gravity_force > this.gravity_force_max) this.gravity_force = this.gravity_force_max;

                    }

                }
                else
                {
                    this.is_falling = true;
                    this.is_mooving = true;
                    this.gravity_force+= this.gravity_acceleration;

                    if(this.gravity_force > this.gravity_force_max) this.gravity_force = this.gravity_force_max;
                }
                
                entities[entities.findIndex((e)=>e.id === this.id)] = this;
                
            }
            
        },10)
    }

    /**
     * Deactivates gravity effects on the player.
     * @async
     * @returns {Promise<void>}
     */
    async clear_gravity() {
        clearInterval(this.gravity_active);
        this.gravity_active = false;
    }

    /**
     * Makes the player jump with the specified height and speed.
     * @async
     *  @private
     * @returns {Promise<void>}
     */
    async #jump()
    {

        let entities = globalVar

        const progress_max = 0.95;
        const start_point = this.y

        this.is_jumping = true;
        this.jump_point = start_point + this.jump_height;
        


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
                    await fix_collision(this, entities, 'up', this.jump_speed);
                    entities[entities.findIndex((e)=>e.id === this.id)] = this;
                    this.is_jumping = false;
                    this.is_falling = true;
                    clearInterval(jump);
                }

            }
            
            entities[entities.findIndex((e)=>e.id === this.id)] = this;

        },10)
    }

    /**
     * Sets the height and speed for the player's jump.
     * @async
     * @param {number} height - The height of the jump.
     * @param {number} speed - The speed of the jump.
     * @returns {Promise<void>}
     */
    async set_jump(height,speed){

        this.jump_height = height;
        this.jump_speed = speed;
        this.jump_initial_speed = speed;

        addEventListener('keydown', (e => {
            
            if (e.key === " " && !this.is_jumping && !this.is_falling && this.alive) {

                this.#jump()
            }
        }))
    }

    /**
     * Handles the death of the player by deactivating all active states and removing the player from the game.
     * @async
     * @returns {Promise<void>}
     */
    async die(){

        return new Promise(async (resolve, reject) => {
        let entities = globalVar;
        this.alive = false;
        await this.unset_movement();
        await this.unset_movement_rendering();
        await this.unset_collision();
        await this.remove_element();
        await this.clear_gravity();
        let index = entities.findIndex((e)=>e.id === this.id)
        if (index !== -1) entities.splice(index, 1);
            
        resolve();
    })
    }

    // async check_life(){

    //     setInterval(async () => {

    //         if (this.life <= 0)await this.die();
        
    //     }, 10);
        
    // }

    /**
     * Detects and returns the direction of collapse between the player and another entity.
     * @async
     * @param {object} entitie - The entity to check for a collision with.
     * @returns {Promise<string|null>} The direction of collapse or null if no collision.
     */
    async collapsed(entitie){

        return await detect_collapse(this, entitie)

    }

    /**
     * Teleports the player to a new position.
     * @async
     * @param {number} x - The x-coordinate to teleport to.
     * @param {number} y - The y-coordinate to teleport to.
     * @param {string} [x_mesure='px'] - The unit of measurement for the x-coordinate ('px' or '%').
     * @param {string} [y_mesure='px'] - The unit of measurement for the y-coordinate ('px' or '%').
     * @returns {Promise<void>}
     */
    async teleport(x,y,x_mesure = 'px', y_mesure = 'px'){

        if (x_mesure === '%') {
            this.x = Math.floor(x * window.innerWidth / 100);
        }
        else {
            this.x = x;
        }

        if (y_mesure === '%') {
            this.y = Math.floor(y * window.innerHeight / 100);
        }
        else {
            
            this.y = y;
        }

        this.width_co = this.x + this.width-1;
        this.height_co = this.y + this.height-1;
    }

    /**
     * Adds an entity to the list of collision exceptions.
     * @async
     * @param {object} exception - The entity to exclude from collisions.
     * @returns {Promise<void>}
     */
    async add_collision_exception(exception)
    {
        this.collision_exceptions.push(exception);
    }

    /**
     * Removes an entity from the list of collision exceptions.
     * @async
     * @param {object} exception - The entity to remove from collision exceptions.
     * @returns {Promise<void>}
     */
    async remove_collision_exception(exception)
    {
        let index = this.collision_exceptions.indexOf(exception);
        if (index!== -1) this.collision_exceptions.splice(index, 1);
    }
}