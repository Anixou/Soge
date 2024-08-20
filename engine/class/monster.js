import Player from './player.js';
import move from '../modele/movement.js';
import {detect_collapse, move_test} from '../modele/movement.js';

/**
 * @class Monster
 * @extends Player
 * @classdesc Represents a monster entity in the game, inheriting from the Player class.
 * Provides additional functionality specific to monsters, such as tracking players.
 */

export default class Monster extends Player
{
    /**
     * Creates an instance of Monster.
     * @param {string | number} id - The unique identifier for the monster.
     * @param {number} [x=0] - The initial x-coordinate position.
     * @param {number} [y=0] - The initial y-coordinate position.
     * @param {string} [x_mesure='px'] - The unit of measurement for the x-coordinate ('px' or '%').
     * @param {string} [y_mesure='px'] - The unit of measurement for the y-coordinate ('px' or '%').
     */

    constructor(id, x = 0, y = 0,x_mesure = 'px', y_mesure = 'px')
    {
        super(id, x, y ,x_mesure, y_mesure);
        this.collision_active = false,
        this.is_jumping = null;
        this.type ='monster';
        this.immobilised = null;
        this.immobilise_on_fall = null;
        globalVar[globalVar.findIndex((e)=>e.id === this.id)] = this;
    }

    /**
     * Throws an error indicating that a method is not available for this type of entity.
     * @private
     * @throws {Error} - Always throws an error when called.
     */
    #error()
    {
        throw new Error("Not available with this type of entitie");
    }

    /**
     * Overrides the set_movement method to prevent monsters from moving like players.
     * Always throws an error.
     */
    set_movement(){
        this.#error();
    }

    unset_movement(){
        this.#error();
    }

    set_jump(){
        this.#error();
    }

    unset_jump(){
        this.#error();
    }

    /**
     * Handles the death of the monster by deactivating all active states and removing the monster from the game.
     * @async
     * @returns {Promise<void>}
     */
    async die(){
        let entities = globalVar;
        this.alive = false;
        this.unset_movement_rendering();
        this.unset_collision();
        this.remove_element();
        this.clear_gravity();
        if(this.track)this.untrack_player();
        let index = entities.findIndex((e)=>e.id === this.id)
        if (index !== -1) entities.splice(index, 1);
    }

    /**
     * Moves the monster in a specified direction by a given distance and speed.
     * @async
     * @param {number} distance - The distance to move.
     * @param {number} speed - The speed at which to move.
     * @param {string} direction - The direction in which to move ('left', 'right', 'up', 'down').
     * @returns {Promise<void>}
     */
    async move(distance,speed,direction)
    {
        this.speed = speed;
        let progress = 0;
        this.is_mooving = true;

        let movement = setInterval(()=>{
            if(progress >= distance)
            {
                clearInterval(movement);
                this.speed = 0;
                this.is_mooving = false;
                return;
            }
            else if(distance-progress < this.speed)
            {
                this.speed = distance-progress;
            }
            move(direction,this);
            progress += this.speed;
            this.save();
        },10)
    }

    /**
     * Detects the direction of a player relative to the monster based on proximity.
     * @private
     * @async
     * @param {object} target - The player entity to detect.
     * @param {number} level - The level of detection (1 for full, 2 for horizontal only == harder for the player).
     * @returns {Promise<string>} - The direction of the player ('left', 'right', 'up').
     */
    async #detect_player(target,level)
    {
        let smallestOverlap;

        // const overlapBottom = target.height_co - this.y;
        const overlapRight = this.width_co - target.x;
        const overlapLeft = target.width_co - this.x;
        if (level === 1)
        {
            const overlapTop = this.height_co - target.y;

            smallestOverlap = Math.min(overlapLeft, overlapRight, overlapTop);
        }
        else if(level === 2) smallestOverlap = Math.min(overlapLeft, overlapRight);
        
        
        if (smallestOverlap === overlapLeft) return "left";
        if (smallestOverlap === overlapRight) return "right";
        if (smallestOverlap === overlapTop) return "up";
    }

    /**
     * Tracks a player by continuously moving the monster towards the player's position.
     * @async
     * @param {object} target - The player entity to track.
     * @param {number} speed - The speed at which to track the player.
     * @param {number} level - The level of tracking (1 for full, 2 for horizontal only).
     * @returns {Promise<void>}
     */
    async track_player(target,speed,level)
    {

        this.track = setInterval(async ()=>{

            if(await detect_collapse(this , target))
            {
                return;
            }

            let direction = await this.#detect_player(target,level)
            
            if (direction === 'left' || direction === 'right')move_test(direction,this,speed);

        },10)
    }

    /**
     * Stops tracking the player by clearing the tracking interval.
     * @async
     * @returns {Promise<void>}
     */
    async untrack_player()
    {
        clearInterval(this.track);
    }
}