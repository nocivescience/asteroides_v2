const gameEl=document.getElementById('games');
const ctx=gameEl.getContext('2d');
gameEl.width=window.innerWidth;
gameEl.height=window.innerHeight;
const shipSize=30;
var ship;
document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);
setInterval(update,25)
newGame();
function newShip(){
    return {
        x:gameEl.width/2,
        y:gameEl.height/2,
        a: 90/180*Math.PI,
        r:shipSize/2,
        blinkNum:Math.ceil(30),
        blinkTime: Math.ceil(3),
        canShoot:true,
        dead:false,
        explodeTime:0,
        lasers:[],
        rot:0,
        thrusting:false,
        thrust:{
            x:0,
            y:0
        }
    }
}
function drawShip(x,y,a,color='white'){
    ctx.strokeStyle=color;
    ctx.lineWidth=shipSize/5;
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(
        x+4/3*ship.r*Math.cos(a),
        y-4/3*ship.r*Math.sin(a)
    );
    ctx.lineTo(
        x-ship.r*(2/3*Math.cos(a)+Math.sin(a)),
        y+ship.r*(2/3*Math.sin(a)-Math.cos(a))
    );
    ctx.lineTo(
        x-ship.r*(2/3*Math.cos(a)-Math.sin(a)),
        y+ship.r*(2/3*Math.sin(a)+Math.cos(a))
    );
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
};
function keyDown(eval){
    switch(eval.key){
        case 'a':
            ship.rot=360/180*Math.PI/30;
            break;
        case 'd':
            ship.rot=-360/180*Math.PI/30;
            break;
        case 'p':
            shootLaser();
            break;
    }
}
function keyUp(eval){
    switch(eval.key){
        case 'a':
            ship.rot=0
        case 'd':
            ship.rot=0
    }
}
function thrustingShip(){
    ctx.fillStyle='red';
    ctx.strokeStyle='yellow';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(
        ship.x-ship.r*(2/3*Math.cos(ship.a)+.5*Math.sin(ship.a)),
        ship.y+ship.r*(2/3*Math.sin(ship.a)-.5*Math.cos(ship.a))
    );
    ctx.lineTo(
        ship.x-ship.r*(5/3+Math.random()*1.4)*Math.cos(ship.a),
        ship.y+ship.r*(5/3+Math.random()*1.4)*Math.sin(ship.a)
    );
    ctx.lineTo(
        ship.x-ship.r*(2/3*Math.cos(ship.a)-.5*Math.sin(ship.a)),
        ship.y+ship.r*(2/3*Math.sin(ship.a)+.5*Math.cos(ship.a)),
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}
function drawLaser(){
    for(var i=0;i<ship.lasers.length;i++){
        ctx.fillStyle='aqua';
        ctx.beginPath();
        ctx.arc(ship.lasers[i].x,ship.lasers[i].y,10*Math.random()<7?7:10*Math.random(),0,2*Math.PI,true);
        ctx.fill();
    }
}
function shootLaser(){
    if(ship.canShoot&&ship.lasers.length<12){
        ship.lasers.push({
            y: ship.y-3*ship.r*Math.sin(ship.a),
            x: ship.x+3*ship.r*Math.cos(ship.a),
            xv: 40*Math.cos(ship.a)/30,
            yv: -40*Math.sin(ship.a)/30,
            dist: 0,
            explodeTime:0,
        })
    };
    ship.canShoot=false;
}
function newGame(){
    ship=newShip()
}
function update(){
    var exploding=ship.explodeTime>0
    ctx.clearRect(0,0,gameEl.width,gameEl.height);
    var blinkOn=ship.blinkNum%2==0;
    let exploding=ship.explodeTime>0;
    //draw ship 
    drawShip(ship.x,ship.y,ship.a);
    drawLaser();
    thrustingShip();
    ship.a+=ship.rot
    for(var i=ship.lasers.length-1;i>=0;i--){
        ship.lasers[i].x+=ship.lasers[i].xv*3;
        ship.lasers[i].y+=ship.lasers[i].yv*3;
    }
}