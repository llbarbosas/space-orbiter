import Ship from './components/ship';
import Planet from './components/planet';

export default class Game {
    static FPS = 60;

    static loop({ ctx, width, height }){
        // Setup
        const player = new Ship(width/2, height/2);
        const earth = new Planet(width/4, height/4);
        document.addEventListener("keydown", player.onKeydown);
        document.addEventListener("keyup", player.onKeyup);
        
        return () => {
            const gameContext = [player, earth];

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            player.update({ width, height, timeDifference: 1/this.FPS, gameContext });
            earth.update({ width, height, gameContext });

            player.draw(ctx);
            earth.draw(ctx);
        }
    }
}