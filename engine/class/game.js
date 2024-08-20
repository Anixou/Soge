/**
 * Represents a game instance, handling the game state and frame management.
 */
export default class Game {

    /**
     * Creates an instance of the `Game` class.
     */
    constructor() {
        
        this.win = false;
        this.lose = false;
    }

    /**
     * Adds a frame to the document body with specified dimensions.
     * @param {string} [height="100vh"] - The height of the frame, default is "100vh".
     * @param {string} [width="100%"] - The width of the frame, default is "100%".
     * @returns {Promise<void>} - A promise that resolves when the frame is added.
     */

    async add_frame(height = "100vh", width = "100%") {
        const frame = document.createElement("div");
        frame.id = "frame";
        frame.style.height = height;
        frame.style.width = width;
        frame.style.position = "relative";

        document.body.appendChild(frame);
    }

    /**
     * Clears the frame by removing all entities that are not of type 'world'.
     * @returns {Promise<void>} - A promise that resolves when the frame is cleared.
     */

    async clear_frame() {
        for (let i = globalVar.length - 1; i >= 0; i--) {
            if (globalVar[i].type !== 'world') {
                await globalVar[i].die();
            }
        }
    }

    /**
     * Sets up the list of world border entities and assigns it to the global variable.
     * @returns {Promise<void>} - A promise that resolves when the entities list is set.
     */
    
    async set_entities_list() {
        this.entities = [
            {
                id: "border_down",
                type: "world",
                alive: true,
                x: 0,
                y: -1,
                width_co: Infinity,
                height_co: -1,
                collision_active: true
            },
            {
                id: "border_up",
                type: "world",
                alive: true,
                x: 0,
                y: window.innerHeight + 1,
                width_co: Infinity,
                height_co: window.innerHeight + 1,
                collision_active: true
            },
            {
                id: "border_left",
                type: "world",
                alive: true,
                x: -Infinity,
                y: 0,
                width_co: -1,
                height_co: Infinity,
                collision_active: true
            },
            {
                id: "border_right",
                type: "world",
                alive: true,
                x: window.innerWidth + 1,
                y: 0,
                width_co: Infinity,
                height_co: Infinity,
                collision_active: true
            }
        ];

        // Assign the list to the global variable
        window.globalVar = this.entities;
    }
}
