export default class Game {

    add_frame(heigth = "100vh",width = "100%"){

        const frame = document.createElement("div");
        frame.id = "frame";
        frame.style.height = heigth;
        frame.style.width = width;
        frame.style.position = "relative";

        document.body.appendChild(frame);

    }

    set_entities_list()
    {
        this.entities = [{
            id: "ground",
            x: 0,
            width: 0,
            heigth: 0,
        }];
    }
}




