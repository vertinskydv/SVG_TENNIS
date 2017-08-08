var svgDocument = document.getElementById("svgD");
var playField = document.getElementById("playingField");
var ball = document.getElementById("ball");
var leftRacket = document.getElementById("racket1");
var rightRacket = document.getElementById("racket2");
var score = document.getElementById("score");
var start = document.getElementById("start");

var stopTimer = 0;

svgDocument.top = svgDocument.getBoundingClientRect().top;
svgDocument.left = svgDocument.getBoundingClientRect().left;
svgDocument.Width = svgDocument.getBoundingClientRect().width;
svgDocument.Height = svgDocument.getBoundingClientRect().height;



playField.Width = playField.getBoundingClientRect().width;
playField.Height = playField.getBoundingClientRect().height;
playField.top = playField.getBoundingClientRect().top - svgDocument.top;
playField.left = playField.getBoundingClientRect().left - svgDocument.left;


function TRacket(r) {
  this.score = 0;
  this.posY = playField.top + playField.Height/2 - r.getBoundingClientRect().height/2 - svgDocument.top;
  this.height = r.getBoundingClientRect().height;
  this.width = r.getBoundingClientRect().width;
  this.left = r.getBoundingClientRect().left - svgDocument.left;
  this.top = r.getBoundingClientRect().top - svgDocument.top;
  this.speedY = 10;
  this.up = false;
  this.down = false;
  this.update = function() {
    r.style.y = this.posY;
  } 
}

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
  }

function randomY (minUp, maxUp, minDown, maxDown) {
  var randUp = minUp - 0.5 + Math.random() * (maxUp - minUp + 1);
  randUp = Math.round(randUp);
  var randDown = minDown - 0.5 + Math.random() * (maxDown - minDown + 1);
  randDown = Math.round(randDown);
  var c = - 0.5 + Math.random() * 2;
  c = Math.round(c);
  var rand;
  c ? rand = randUp: rand = randDown;
  return rand;
}

var ballH = {
  width: ball.getBoundingClientRect().width,
  height: ball.getBoundingClientRect().height,
  posX: playField.left + playField.Width/2 - ball.getBoundingClientRect().width/2,
  posY: playField.top + playField.Height/2 - ball.getBoundingClientRect().height/2,
  speedX: 3,
  speedY: 3,
  maxSpeedYDown: 10,
  maxSpeedYUp: -10,
  minSpeedYDown: 5,
  minSpeedYUp: -5,
  update: function(){
    ball.setAttribute("cx",  this.posX + "px");
    ball.setAttribute("cy",  this.posY + "px");

  },
  lastWinner: randomInteger(0, 1) ? "right" : "left"
}



ballH.update();

var rL = new TRacket(leftRacket);
var rR = new TRacket(rightRacket);

rL.update();
rR.update();

document.addEventListener("keydown", racketDirection);
function racketDirection(EO) {
  if (EO.keyCode == 38)
    rR.up = true;
  if (EO.keyCode == 40)
    rR.down = true;
  if (EO.keyCode == 16)
    rL.up = true;
  if (EO.keyCode == 17)
    rL.down = true;
}

document.addEventListener("keyup", racketDirectionR);
function racketDirectionR(EO) {
  if (EO.keyCode == 38)
    rR.up = false;
  if (EO.keyCode == 40)
    rR.down = false;
  if (EO.keyCode == 16)
    rL.up = false;
  if (EO.keyCode == 17)
    rL.down = false;
}



start.addEventListener("mousedown", startGame);
function startGame(EO) {
  ballH.posX = playField.left + playField.Width / 2,
  ballH.posY = playField.top + playField.Height / 2,
  ballH.update();
  
  if (ballH.lastWinner == "left") {
    ballH.speedX = - Math.abs(ballH.speedX);
    ballH.speedY = randomY(ballH.maxSpeedYUp, ballH.minSpeedYUp, ballH.minSpeedYDown, ballH.maxSpeedYDown);
    } else {
    ballH.speedX = Math.abs(ballH.speedX);
    ballH.speedY = randomY(ballH.maxSpeedYUp, ballH.minSpeedYUp, ballH.minSpeedYDown, ballH.maxSpeedYDown);
    }
  
  if (stopTimer) {
    clearInterval(stopTimer);
  }
  stopTimer = setInterval(tick, 40);  

}


function tick(){
  
 //  ========Передвижение мяча
  ballH.posX += ballH.speedX;
  ballH.posY += ballH.speedY;
  
//  вылетел ли мяч правее стены
  if (ballH.posX + ballH.width/2 > playField.Width) {
    ballH.posX = playField.left + playField.Width - ballH.width/2;
    clearInterval(stopTimer);
    rL.score += 1;
    score.textContent = rL.score + ":" + rR.score;
    ballH.lastWinner = "left";
  }
  
  
//  коснулся ли правой ракетки
  if (((ballH.posX + ballH.width / 2)- rR.left  <= ballH.speedX) &&
    ((ballH.posX + ballH.width / 2)- rR.left >= 0) && 
    (ballH.posY >= rR.posY - ballH.height * 7 / 8) && 
    (ballH.posY <= rR.posY + rR.height - ballH.height * 1 / 8))
  { ballH.posX = rR.left - ballH.width/2 - ballH.speedX;
    
    ballH.speedX = -ballH.speedX;
    ballH.posX -= ballH.speedX;
    ballH.posY -= ballH.speedY;}
  
  
//  левее стены?
  if (ballH.posX <= playField.left + ballH.width / 2){
    ballH.posX = playField.left + ballH.width / 2;
    clearInterval(stopTimer);
    rR.score += 1;
    score.textContent = rL.score + ":" + rR.score;
    ballH.lastWinner = "right";
  }
  
  //  коснулся ли левой ракетки
  if ((ballH.posX - ballH.width/2 - (rL.left + rL.width) >= ballH.speedX) &&
    (ballH.posX - ballH.width/2 - (rL.left + rL.width) <= 0) && 
    (ballH.posY >= rL.posY - ballH.height * 7 / 8) && 
    (ballH.posY <= rL.posY + rL.height - ballH.height * 1 / 8)) 
  { ballH.posX = rL.left + rL.width + ballH.width/2 + ballH.speedX;
    ballH.speedX = -ballH.speedX;
    ballH.posX += ballH.speedX;
    ballH.posY += ballH.speedY;}
  

 
  
//  если вылетел выше потолка
  if (ballH.posY - ballH.height/2 <=  playField.top) {
    ballH.posY = playField.top + ballH.height/2;
    ballH.speedY = -ballH.speedY;
  }
//  ниже пола?
  if (ballH.posY + ballH.height/2 > playField.top + playField.Height) {
    ballH.posY = playField.top + playField.Height - ballH.height/2;
    ballH.speedY = -ballH.speedY;
  }
  
  

//______________предвижение ракеток
  if (rL.up) {
    rL.posY -= rL.speedY; 
    if (rL.posY <= playField.top) {
      rL.posY = playField.top;
    }
  }
  
  if (rL.down) {
    rL.posY += rL.speedY; 
    if (rL.posY >= playField.top + playField.Height - rL.height) {
      rL.posY =  playField.top + playField.Height - rL.height;
    }
  }  
  
  rL.update();

  
  if (rR.up) {
    rR.posY -= rR.speedY; 
    if (rR.posY < playField.top) {
      rR.posY = playField.top;
    }
  }
  
  if (rR.down) {
    rR.posY += rR.speedY; 
    if (rR.posY >= playField.top + playField.Height - rR.height) {
      rR.posY = playField.top + playField.Height - rR.height;
    }
  }  
  
  rR.update();
  
 

  ballH.update();
  //skjdfhksdf
  
}

