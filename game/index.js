import Game from "../engine/class/game.js";
import level1 from "./level/level1.js";
import level2 from "./level/level2.js";

let game = new Game();
await game.add_frame();
await game.set_entities_list(); 

let level = 1;

level1(game);
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
        await game.set_entities_list();
        if (level === 2) level2(game);
    }
    if (game.lose) {
        game.lose = false;
        alert("You lose!");
        await game.clear_frame();
        await game.set_entities_list();
        if (level === 2) level2(game);
        else level1(game);
        return;
    }

}, 10);

