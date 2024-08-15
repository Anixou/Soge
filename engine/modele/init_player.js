import Player from "../class/player.js";

export default async function init_player(player_param)
{
    let player = new Player(player_param.id,player_param.x,player_param.y);
    await player.create_element(player_param.height,player_param.width,player_param.css_id,player_param.color);
    await player.render_movement();
    await player.active_collision();
    await player.set_movement(player_param.speed_min,player_param.speed_max,player_param.time_for_max_speed);
    await player.active_gravity(player_param.gravity_max,player_param.gravity_min);
    await player.set_jump(player_param.jump_height,player_param.jump_speed);

    return player;
}