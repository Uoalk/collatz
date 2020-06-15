var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");

var scale;
var tranX;
var tranY;

new EasyPZ(document.getElementById("canvas"), function(transform) {
    scale=transform.scale;
    tranX=transform.translateX;
    tranY=transform.translateY;
    draw(transform.scale, transform.translateX, transform.translateY);
},{ minScale: 0.1, maxScale: 10000, bounds: { top: -100000, right: 100000, bottom: 100000, left: -100000 } });
draw(0,0,0)

function draw(scale,tranX,tranY){
  ctx.clearRect(0,0,canvas.width,canvas.height)

  ctx.save();
  ctx.transform(scale, 0, 0, scale, tranX, tranY);

  //drawLine(0,canvas.height/2,canvas.width,canvas.height/2)
  //drawLine(canvas.width/2, 0, canvas.width/2, canvas.height)

  drawnNumbers=[];
  recursiveDrawNode(canvas.width/2,canvas.height/2,50,-0.1,1);


  ctx.restore();
}
function drawNode(x,y,r,number){
  drawCircle(x,y,r)
  ctx.fillStyle="white"
  ctx.fill()

  ctx.textAlign="center";
  ctx.textBaseline = "middle";
  ctx.fillStyle="black"
  ctx.font=r/2+"px Arial"
  ctx.fillText(Math.floor(number),x,y)
}
var lineLengthMultiplier=5;//how many times the connecting line is bigger than the radius
var rScale=0.8;//multiplier for the radius of the next node
var angleIncrease=-0.5;//change in angle for each spiral
function recursiveDrawNode(x,y,r,angle,number){

  drawNode(x,y,r,number)
  if(r*scale>1){
    //2n
    drawToNode(x,y,r,angle,number*2)

    //3n+1
    if(Number.isInteger((number-1)/3) && (number-1)/3>0){
      drawToNode(x,y,r,angle+Math.PI/2,(number-1)/3)
    }
  }
}
function drawToNode(x,y,r,angle,number){
  var newR=r*rScale;
  var newX=x+Math.cos(angle)*(lineLengthMultiplier*r);
  var newY=y+Math.sin(angle)*(lineLengthMultiplier*r);

  var startX=x+Math.cos(angle)*r;
  var startY=y+Math.sin(angle)*r;
  var endX=x+Math.cos(angle)*(lineLengthMultiplier*r-newR);
  var endY=y+Math.sin(angle)*(lineLengthMultiplier*r-newR);

  drawLine(startX,startY,endX,endY)
  recursiveDrawNode(newX,newY,newR,angle+angleIncrease,number)
}
function drawCircle(x,y, r) {

    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.stroke();

}
function drawLine(x1,y1,x2,y2){
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.lineWidth=1/scale;
  ctx.stroke();
}
