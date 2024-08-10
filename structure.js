import move from './movement.js';
import Player from './player.js';

export default class Structure extends Player
{
    constructor(id, x=0, y=0)
    {
        super(id, x, y);
        this.collision_active = true,
        this.is_jumping = null;
        this.type ='structure';
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
    
    async break(){
        this.die();
    }

    active_collision(){
        this.#error();
    }

    unset_collision(){
        this.#error();
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
            globalVar[globalVar.findIndex((e)=>e.id === this.id)] = this;

        },10)
    }


}