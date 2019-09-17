import Ship from './components/ship';

export default class Game {
    static FPS = 60;

    static loop({ ctx, width, height }){
        // Setup
        const player = new Ship(width/2, height/2);
        document.addEventListener("keydown", player.onKeydown);
        document.addEventListener("keyup", player.onKeyup);
        
        return () => {
            // Loop 

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            player.update({ width, height });
            player.draw(ctx);
        }
    }
}