import Ship from './components/ship';
import Planet from './components/planet';
import Camera from './components/camera';

export default class Game {
    static FPS = 60;

    static loop({ ctx, width, height }){
        // Setup
        const player = new Ship(width/2, height/2);
        const earth = new Planet(width, height);
        const mars = new Planet(200000, 200000);
        const camera = new Camera(width, height, 0, 0);
        
        document.addEventListener("keydown", player.onKeydown);
        document.addEventListener("keyup", player.onKeyup);

        const background = new Image();
        background.src = "background.jpg";
        
        return () => {
            const gameElements = [player, earth, mars];

            player.update({ width, height, timeDifference: 1/this.FPS, gameElements, Camera: camera });
            earth.update({ width, height, timeDifference: 1/this.FPS, gameElements});
            mars.update({ width, height, timeDifference: 1/this.FPS, gameElements});

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(background, -camera.position.x/20, -camera.position.y/20);

            ctx.save();
            
            ctx.translate(-camera.position.x, -camera.position.y);
        
            player.draw(ctx);
            earth.draw(ctx);
            mars.draw(ctx);

            ctx.restore();
        }
    }
}