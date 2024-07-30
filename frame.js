export default function add_frame(){

    const frame = document.createElement("div");
    frame.id = "frame";
    frame.style.height = "100vh";
    frame.style.width = "100%";
    frame.style.position = "relative";

    document.body.appendChild(frame);

}