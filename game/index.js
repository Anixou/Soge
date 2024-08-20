import Game from "../engine/class/game.js";
import level1 from "./level/level1.js";
import level2 from "./level/level2.js";

let game = new Game();
await game.add_frame();
await game.set_entities_list(); 

let level = 1;

level1(game);
alert("Objecitf : atteindre le bloc jaune");

setInterval(async () => {
    if (game.win) {
        game.win = false;
        if (level === 2) {
            alert("You win!");
            location.reload();
            return;
        }
        level++;

        await game.clear_frame();
        if (level === 2) level2(game);
    }

}, 10);

