

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");

var scale=1;
var tranX=0;
var tranY=0;

var lineLengthMultiplier=5;//how many times the connecting line is bigger than the radius
var rScale=0.8;//multiplier for the radius of the next node
var angleIncrease=-0.69;//change in angle for each spiral
var minDrawRadius=1;
var allowLoop=false;
var allowPhantom=false;
var allowThrees=true;

class Num {
  constructor(x,y,r, angle, number){
    this.x=x;
    this.y=y;
    this.r=r;
    this.angle=angle;
    this.number=number;
    this.children=[];
  }
  draw(){
    if(this.isVisible())drawNode(this.x,this.y,this.r,this.number)
  }
  drawLines(){
    if(!this.isVisible())return;
    for(var num of this.children){
      var angle=Math.atan2((this.y-num.y),(this.x-num.x));
      var startX=this.x-Math.cos(angle)*this.r;
      var startY=this.y-Math.sin(angle)*this.r;
      var endX=num.x+Math.cos(angle)*(num.r);
      var endY=num.y+Math.sin(angle)*(num.r);
      drawLine(startX,startY,endX,endY)
    }
  }
  generateChildren(){
    this.children.push(makeNextNum(this.x,this.y,this.r,this.angle+angleIncrease,this.number*2))
    if(isValidBranch((this.number-1)/3)){

      this.children.push(makeNextNum(this.x,this.y,this.r,this.angle+Math.PI/2,(this.number-1)/3));
    }
  }
  generateLowestLayer(){
    if(this.children.length==0){
      this.generateChildren();
    }else{
      for(var i of this.children){
        i.generateLowestLayer();
      }
    }
  }
  drawAll(){
    if(this.r*scale<minDrawRadius)return;
    this.draw();
    this.drawLines();
    for(var i of this.children){
      if(i.hasVisibleChild())i.drawAll();
    }
  }
  isVisible(){
    var left=-tranX/scale;
    var top=-tranY/scale;
    var right=(canvas.width-tranX)/scale;
    var bottom=(canvas.height-tranY)/scale;

    if(this.x+this.r>left && this.x-this.r<right && this.y+this.r>top && this.y-this.r<bottom)return true;
    return false;
  }
  hasVisibleChild(){
    if(this.isVisible())return true;
    if(this.r*scale>minDrawRadius){
      for(var i of this.children){
        if(i.hasVisibleChild()) return true;
      }
    }

    return false;
  }
  getSmallestRadius(){
    if(this.children.length==0)return this.r;
    else return this.children[0].getSmallestRadius();
  }
  killChildren(){
    this.children=[];
  }
}
function makeNextNum(x,y,r,angle,number){
  var newR=r*rScale;
  var newX=x+Math.cos(angle)*(lineLengthMultiplier*r);
  var newY=y+Math.sin(angle)*(lineLengthMultiplier*r);

  return new Num(newX,newY,newR,angle,number)

}
function isValidBranch(num){
  if(!Number.isInteger(num)){return false};// is not 3n+1
  if(num==0) return false; // is not 0
  if(num==1 && !allowLoop) return false;
  if(num % 2 == 0 && !allowPhantom) return false;
  if(num%3 == 0 && !allowThrees) return false;
  return true;
}
new EasyPZ(document.getElementById("canvas"), function(transform) {
    scale=transform.scale;
    tranX=transform.translateX;
    tranY=transform.translateY;
    draw(transform.scale, transform.translateX, transform.translateY);
},{ minScale: 0.2, maxScale: 1500, bounds: { top: -100000, right: 100000, bottom: 100000, left: -100000 } });


function updateOptions(){
  lineLengthMultiplier=parseFloat(document.getElementById("lineLength").value);
  rScale=parseFloat(document.getElementById("radiusScale").value)
  angleIncrease=-parseFloat(document.getElementById("angleIncrease").value)
  minDrawRadius=parseFloat(document.getElementById("drawRadius").value)

  allowThrees=document.getElementById("threes").checked
  allowLoop=document.getElementById("loop").checked
  allowPhantom=document.getElementById("phantom").checked

  headNum.killChildren();
  draw();
}


function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height)

  ctx.save();
  ctx.transform(scale, 0, 0, scale, tranX, tranY);
  //drawLine(0,canvas.height/2,canvas.width,canvas.height/2)
  //drawLine(canvas.width/2, 0, canvas.width/2, canvas.height)

  //recursiveDrawNode(canvas.width/2,canvas.height/2,50,-0.1,1);
  treeDrawNodes(canvas.width/2,canvas.height/2,50,0,1);

  ctx.restore();
}
draw()
function drawNode(x,y,r,number){
  ctx.lineWidth=1/scale;
  drawCircle(x,y,r)
  ctx.fillStyle="white"
  if(Number.isInteger(number/3))ctx.fillStyle="red"
  ctx.fill()

  ctx.textAlign="center";
  ctx.textBaseline = "middle";
  ctx.fillStyle="black"

  ctx.font=min(3*r/((number+"").length),30)+"px Arial"
  ctx.fillText(Math.floor(number),x,y)
}

function min(a,b){
  return a>b?b:a;
}

var headNum;


function treeDrawNodes(x,y,r, angle,number){
  if(headNum===undefined){
    headNum=new Num(x,y,r,angle,number);
    for(var i=0;i<10;i++)headNum.generateLowestLayer();
    updateOptions();

  }
  while(headNum.getSmallestRadius()*scale>minDrawRadius){
    headNum.generateLowestLayer();
  }
  headNum.drawAll()
}

function recursiveDrawNode(x,y,r,angle,number){

  drawNode(x,y,r,number)
  if(r*scale>0.1){
    //2n
    drawToNode(x,y,r,angle,number*2)

    //3n+1
    if(Number.isInteger((number-1)/3) && (number-1)/3>1 && (number-1)/3 % 2 != 0){
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
