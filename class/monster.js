import Player from './player.js';
import move from '../movement.js';

export default class Monster extends Player
{
    constructor(id, x=0, y=0)
    {
        super(id, x, y);
        this.collision_active = false,
        this.is_jumping = null;
        this.type ='monster';
        this.immobilised = null;
        this.immobilise_on_fall = null;
        globalVar[globalVar.findIndex((e)=>e.id === this.id)] = this;
    }

    #error()
    {
        throw new Error("Not available with this type of entitie");
    }

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

    async die(){
        let entities = globalVar;
        this.alive = false;
        this.unset_movement_rendering();
        this.unset_collision();
        this.remove_element();
        this.clear_gravity();
        let index = entities.findIndex((e)=>e.id === this.id)
        if (index !== -1) entities.splice(index, 1);
    }

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
}