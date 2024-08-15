export default class Game {

    async add_frame(heigth = "100vh",width = "100%"){

        const frame = document.createElement("div");
        frame.id = "frame";
        frame.style.height = heigth;
        frame.style.width = width;
        frame.style.position = "relative";

        document.body.appendChild(frame);

    }
    
    async clear_frame()
    {
        for (let i = globalVar.length-1; i >= 0 ; i--) {
            if (globalVar[i].type !== 'world')
                globalVar[i].die();
        }
    }

    async set_entities_list()
    {
        this.entities = [{
            id: "border_down",
            type : "world",
            x: 0,
            y: -1,
            width_co: Infinity,
            height_co: -1,
            collision_active: true
        },{
            id: "border_up",
            type : "world",
            x: 0,
            y: window.innerHeight+1,
            width_co: Infinity,
            height_co: window.innerHeight+1,
            collision_active: true
        },{
            id: "border_left",
            type : "world",
            x: -Infinity,
            y: 0,
            width_co: -1,
            height_co:Infinity,
            collision_active: true
        },{
            id: "border_right",
            type : "world",
            x: window.innerWidth+1,
            y: 0,
            width_co: Infinity,
            height_co: Infinity,
            collision_active: true
        }];

        window.globalVar = this.entities;
    }

}




