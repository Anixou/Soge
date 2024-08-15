import Monster from './monster.js';

export default class Structure extends Monster
{
    constructor(id, x = 0, y = 0,x_mesure = 'px', y_mesure = 'px')
    {
        
        super(id, x, y,x_mesure, y_mesure);
        
        this.type ='structure';
        globalVar[globalVar.findIndex((e)=>e.id === this.id)] = this;
    }

    async active_collision()
    {
        this.collision_active = true;
    }

    async unset_collision(){
        this.active_collision = false;
    }

}