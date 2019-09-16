export default class Game {
    static FPS = 30;

    static loop({ ctx, width, height }){
        // Setup
        
        return () => {
            // Loop 

            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);
        }
    }
}