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
            id: "border_down",
            x: 0,
            y: -1,
            width_co: Infinity,
            height_co: -1,
            collision_active: true
        },{
            id: "border_up",
            x: 0,
            y: window.innerHeight+1,
            width_co: Infinity,
            height_co: window.innerHeight+1,
            collision_active: true
        },{
            id: "border_left",
            x: -Infinity,
            y: 0,
            width_co: -1,
            height_co:Infinity,
            collision_active: true
        },{
            id: "border_right",
            x: window.innerWidth+1,
            y: 0,
            width_co: Infinity,
            height_co: Infinity,
            collision_active: true
        }];

        window.globalVar = this.entities;
    }

}




