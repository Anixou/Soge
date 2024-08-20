import Game from "../engine/class/game.js";
import level1 from "./level/level1.js";
import level2 from "./level/level2.js";

let game = new Game();
await game.add_frame();
await game.set_entities_list(); 

const levels = {"1" : level1, "2" : level2};
let level = 1;
const level_max = 2;
alert("Objecitf : Monter sur le bloc jaune");


levels[level](game);

setInterval(async () => {

    if (game.win) {

        game.win = false;

        if (level === level_max) {

            alert("You win!");
            location.reload();
            return;
        }

        level++;
        alert("bravo!");

        await game.clear_frame();
        levels[level](game);
    }

}, 10);

