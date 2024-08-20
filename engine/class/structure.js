import Monster from './monster.js';

/**
 * Represents a structure in the game, inheriting properties and methods from `Monster`.
 * @extends Monster
 */
export default class Structure extends Monster {

    /**
     * Creates an instance of the `Structure` class.
     * @param {number} id - The unique identifier for the structure.
     * @param {number} [x=0] - The horizontal position of the structure in pixels (or other unit).
     * @param {number} [y=0] - The vertical position of the structure in pixels (or other unit).
     * @param {string} [x_mesure='px'] - The unit of measurement for the horizontal position.
     * @param {string} [y_mesure='px'] - The unit of measurement for the vertical position.
     */

    constructor(id, x = 0, y = 0, x_mesure = 'px', y_mesure = 'px') {

        super(id, x, y, x_mesure, y_mesure);
        
        this.type = 'structure';

        // Updates the global variable with the new instance
        globalVar[globalVar.findIndex((e) => e.id === this.id)] = this;
    }

    /**
     * Activates collision for this structure.
     * @returns {Promise<void>} - A promise that resolves when the collision is activated.
     */

    async active_collision() {
        this.collision_active = true;
    }

    /**
     * Deactivates collision for this structure.
     * @returns {Promise<void>} - A promise that resolves when the collision is deactivated.
     */
    
    async unset_collision() {
        this.collision_active = false;
    }
}
