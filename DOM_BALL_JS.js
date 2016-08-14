var svgDocument = document.getElementById("svgD");
var playField = document.getElementById("playingField");
var ball = document.getElementById("ball");
var leftRacket = document.getElementById("racket1");
var rightRacket = document.getElementById("racket2");
var score = document.getElementById("score");
var start = document.getElementById("start");

var stopTimer = 0;

function TRacket(r) {
  this.score = 0;
  this.posY = playField.getBoundingClientRect().top + playField.getBoundingClientRect().height/2 - r.getBoundingClientRect().height/2;
  this.height = r.getBoundingClientRect().height;
  this.width = r.getBoundingClientRect().width;
  this.speedY = 10;
  this.up = false;
  this.down = false;
  this.update = function() {
    r.style.y = this.posY;
  } 
}

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
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
  posX: playField.offsetWidth/2 - ball.offsetWidth/2,
  posY: playField.offsetHeight/2 - ball.offsetHeight/2,
  speedX: 8,
  speedY: 8,
  maxSpeedYDown: 10,
  maxSpeedYUp: -10,
  minSpeedYDown: 5,
  minSpeedYUp: -5,
  update: function(){
    ball.style.left = this.posX;
    ball.style.top = this.posY;
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
  ballH.posX = playField.getAttribute("width")/2 - ball.getAttribute("width")/2,
  ballH.posY = playField.getAttribute("height")/2 - ball.getAttribute("height")/2,
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
//  ballH.posX += ballH.speedX;
//  ballH.posY += ballH.speedY;
  
//  вылетел ли мяч правее стены
  if (ballH.posX + ball.offsetWidth > playField.offsetWidth) {
    ballH.posX = playField.offsetWidth - ball.offsetWidth;
    clearInterval(stopTimer);
    rL.score += 1;
    score.textContent = rL.score + ":" + rR.score;
    ballH.lastWinner = "left";
  }
  
  
//  коснулся ли правой ракетки
  if (((ballH.posX + ball.offsetWidth)- rightRacket.offsetLeft  <= ballH.speedX) &&
    ((ballH.posX + ball.offsetWidth)- rightRacket.offsetLeft >= 0) && 
    (ballH.posY >= rR.posY - ball.offsetHeight * 7 / 8) && 
    (ballH.posY <= rR.posY + rightRacket.offsetHeight - ball.offsetHeight * 1 / 8)) 
  { ballH.posX = rightRacket.offsetLeft - ball.offsetWidth - ballH.speedX;
    
    ballH.speedX = -ballH.speedX;
    ballH.posX -= ballH.speedX;
    ballH.posY -= ballH.speedY;}
  
  
//  левее стены?
  if (ballH.posX < 0){
    ballH.posX = 0;
    clearInterval(stopTimer);
    rR.score += 1;
    score.textContent = rL.score + ":" + rR.score;
    ballH.lastWinner = "right";
  }
  
  //  коснулся ли левой ракетки
  if ((ballH.posX - (leftRacket.offsetLeft + leftRacket.offsetWidth) >= ballH.speedX) &&
    (ballH.posX- (leftRacket.offsetLeft + leftRacket.offsetWidth) <= 0) && 
    (ballH.posY >= rL.posY - ball.offsetHeight * 7 / 8) && 
    (ballH.posY <= rL.posY + leftRacket.offsetHeight - ball.offsetHeight * 1 / 8)) 
  { ballH.posX = leftRacket.offsetLeft + leftRacket.offsetWidth + ballH.speedX;
    ballH.speedX = -ballH.speedX;
    ballH.posX += ballH.speedX;
    ballH.posY += ballH.speedY;}
  

 
  
//  если вылетел выше потолка
  if (ballH.posY < 0) {
    ballH.posY = 0;
    ballH.speedY = -ballH.speedY;
  }
//  ниже пола?
  if (ballH.posY + ball.offsetHeight > playField.offsetHeight) {
    ballH.posY = playField.offsetHeight - ball.offsetHeight;
    ballH.speedY = -ballH.speedY;
  }
  
  

//______________предвижение ракеток
  if (rL.up) {
    rL.posY -= rL.speedY; 
    if (rL.posY < getBoundingClientRect) {
      rL.posY = parseInt(playField.getAttribute("y"));
    }
  }
  
  if (rL.down) {
    rL.posY += rL.speedY; 
    if (rL.posY > parseInt(playField.getAttribute("y")) +  parseInt(playField.getAttribute("height")) -  parseInt(leftRacket.getAttribute("height"))) {
      rL.posY =  playField.getAttribute("y") + playField.getAttribute("height") - leftRacket.getAttribute("height");
    }
  }  
  
  rL.update();

  
  if (rR.up) {
    rR.posY -= rR.speedY; 
    if (rR.posY < 0) {
      rR.posY = 0;
    }
  }
  
  if (rR.down) {
    rR.posY += rR.speedY; 
    if (rR.posY > playField.offsetHeight - rightRacket.offsetHeight) {
      rR.posY = playField.offsetHeight - rightRacket .offsetHeight;
    }
  }  
  
  rR.update();
  
 

  ballH.update();
  
}

