/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 */
export function drawCircle(ctx, x, y, radius, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
}