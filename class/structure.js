import Monster from './monster.js';

export default class Structure extends Monster
{
    constructor(id, x=0, y=0)
    {
        super(id, x, y);
        this.collision_active = false,
        this.is_jumping = null;
        this.type ='structure';
        this.immobilised = null;
        this.immobilise_on_fall = null;
        globalVar[globalVar.findIndex((e)=>e.id === this.id)] = this;
    }

    active_collision()
    {
        this.collision_active = true;
    }

    unset_collision(){
        this.active_collision = false;
    }

}