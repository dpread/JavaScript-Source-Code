window. onload = function ()
{
var canvas = document.getElementById("myCanvas"); // sets which div in the html the canvas will go in
var context = canvas.getContext("2d"); // creates 2D canvas and calls it "contex"
context.fillStyle = "Black";
context.fillRect(0, 0, canvas.width, canvas.height);
//Falcon Stats
var xcoord=100; //coordinates of user conrolled falcon
var ycoord=100; //coordinates of user conrolled falcon 
var health = 2; // health of Falcon
var xLaser = 0;

var arrayFL = [];
var iterFLMod = 10; // x distance laser is moved per iteration
var FalcIncrement = 10; // increment green square is moved per key press

//Enemy Stats
var sizeOfArray = 0;
var xcoordBlack = 520; //coordinates of limit of 
var ycoordBlack = 20; //coordinates of automatically moving red square
var widthBlack = 25; //red square width 
var heightBlack = 25; //red square height
var nModEnemyX = 7; // x distance enemy is moved per iteration
var iter = 0;
var arrayE = [];       //Array of Enemies
//Game Stuff
var snd = new Audio("tie_fighter.wav"); // buffers automatically when created
var explode = new Audio("explode.wav"); // buffers automatically when created
var vid = document.getElementById("myVideo"); 
var gameOver = false;
//PowerUp
var xcoordPowerUp = 520; //coordinates of limit of 
var ycoordPowerUp = 20; //coordinates of automatically moving red square
var collected = false;
var level = 1;
var score = 0;
var inUse = false;
//keyEvents
var space = false;
var xW = false;
var left = false;
var right = false;
var up = false;
var down = false;

var created = false;
//Death Star
var dStarX = 1500;
var dStarY = 200;
var shootX = 0;
var shootY = 0
var starkiller = true;
var deathStar = true;
//You need to add code here to detect the keypress
window.addEventListener('keyup', function (key){
if (key.which == 32){space = false;}


if (key.which == 37){left = false;}

if (key.which == 39){right = false;}

if (key.which == 38){up = false;}

if (key.which == 40){down = false;}

if (key.which == 88){xW = false;}


});

window.addEventListener('keydown', function (key){
if (key.which == 32){space = true;}

if (key.which == 37){left = true;}

if (key.which == 39){right = true;}

if (key.which == 38){up = true;}

if (key.which == 40){down = true;}

if (key.which == 88){xW = true;}

});
function playVid() { 
    vid.play(); 
} 

function pauseVid() { 
    vid.pause(); 
} 
function animateEnemies(){
	context.fillStyle = "Black"; // Sets fill style to black
	arrayE.forEach(function(entry) {
    var newV = entry.cur - iter;
	iter += nModEnemyX;
	if (newV >= 1-entry.width) {
		if (entry.identifier == "tie" ) {
			// create Tie-Fighters
			context.beginPath();
			context.lineWidth="2";
			context.strokeStyle="LightGrey";
			context.rect(newV, entry.yValue, entry.width, entry.height); //Draws black square
			context.stroke();
		}
		if (entry.identifier == "destroyer") {
//document.getElementById("demo").innerHTML = nModEnemyX;

			// create Star-Destroyers
			context.fillStyle = "White"; // Sets fill style to grey
			context.fillRect(newV, entry.yValue, entry.width, entry.height); //Draws black square
		}
		arrayFL.forEach(function(laser) {
			checkCollision(laser.cur, laser.yValue, entry, newV, "laser",entry.width, entry.height, laser); // check for collision lasers
			if (entry.health <= 0) {

				score = score + entry.point;
				var delet = arrayE.indexOf(entry);
				arrayE.splice(delet, 1);
		}
		});
		if (inUse) {
			
			// Check collision of xWing
			checkCollision(xcoord+50, ycoord+10, entry, newV, "xWing", entry.width, entry.height); // check for collision XWing
		}
		checkCollision(xcoord, ycoord, entry, newV, "falcon", entry.width, entry.height); // check for collision Falcon

}else 
{	var del = arrayE.indexOf(entry);
	arrayE.splice(del, 1);
}
});
}

// return true if the rectangle and circle are colliding
function rectCircleColliding(entry){
    var distX = Math.abs(dStarX-210 - entry.cur-10);
    var distY = Math.abs(dStarY - entry.yValue-5);
	

    if (distX > (10 + 40)) { return false; }
    if (distY > (5 + 40)) { return false; }

    if (distX <= (10)) { return true; } 
    if (distY <= (5)) { return true; }

    var dx=distX-10;
    var dy=distY-5;
    return (dx*dx+dy*dy<=(40*40));
}
function animateFalconLaser(){ 
	  arrayFL.forEach(function(entry) {
		entry.cur += 10;

	if (entry.cur < 800) {
		context.fillStyle = "Red"; // Sets fill style to red
		context.fillRect(entry.cur, entry.yValue, 20, 10); //Draws black square
		context.stroke();
		if (level == 3) {
			if ((starkiller) && rectCircleColliding(entry)) {
				explode.playbackRate = 4;
				explode.play();
				score = score + 10;
				starkiller = false;
			}
		}
	}else 
	{	var del = arrayFL.indexOf(entry);
		arrayFL.splice(del, 1);
	}
	});
}
function checkCollision(xC, yC, enemy, newValue, identifier, width, height,laser) {

    if (xC > (newValue-width) && xC < (newValue+width) && yC > (enemy.yValue-height) && yC < (enemy.yValue+height)) 
	{
	if (identifier == "falcon") {
	  if (health > 0){
	   health = health - 1;
	   	var dele = arrayE.indexOf(enemy);
		arrayE.splice(dele, 1);
	  }
	}
	if(identifier == "xWing") {
		inUse = false;
		var dele = arrayE.indexOf(enemy);
		arrayE.splice(dele, 1);
	}
	if (identifier == "laser") {
		var delet = arrayFL.indexOf(laser);
		arrayFL.splice(delet, 1);
		enemy.health = enemy.health - 1;

	}
		snd.playbackRate = 4;
        snd.play();

      return true;
    }
    else
    {
      return false;
    }
  }
function checkCollisionPowerUp() {

    if (xcoord > (xcoordPowerUp-30) && xcoord < (xcoordPowerUp+30) && ycoord > (ycoordPowerUp-20) && ycoord < (ycoordPowerUp+20)) 
	{
		collected = true;
		inUse = true;
	}
}
function randomV(min, max) {
	
	var value = Math.floor(Math.random() * (max - min + 1)) + min;
	return value;
}
function createEnemies() {

	if (level == 1) {
		for (var i = 0; i <= 2; i++) {
			var enemy = null;
				if ( i == 2) {
					 enemy = {cur: xcoordBlack, incr: randomV(700, 2000), yValue: randomV(0, 345), identifier: "destroyer" , width: widthBlack + 70 ,height: heightBlack + 30, health: 4, point:2  };

				} else {
		 enemy = {cur: xcoordBlack, incr: randomV(700, 2000), yValue: randomV(0, 375), identifier: "tie", width: widthBlack ,height: heightBlack, health: 2, point:1   };
				}
		enemy.cur += enemy.incr;
		arrayE[i] = enemy;
		sizeOfArray = arrayE.length;
		
		}
		}
	if (level == 2) {
		for (var i = 0; i <= 6; i++) {
			var enemy = null;
				if ( i > 2) {
					 enemy = {cur: xcoordBlack, incr: randomV(700, 3000), yValue: randomV(0, 345), identifier: "destroyer" , width: widthBlack + 70 ,height: heightBlack + 30, health: 4, point:2  };
				} else {
		 enemy = {cur: xcoordBlack, incr: randomV(700, 3000), yValue: randomV(0, 375), identifier: "tie", width: widthBlack ,height: heightBlack, health: 2, point:1   };
				}
		enemy.cur += enemy.incr;
		arrayE[i] = enemy;
		sizeOfArray = arrayE.length;

		}
		}
	if (level == 3) {
		for (var i = 0; i <= 10; i++) {
			var enemy = null;

			if ( i > 3) {
				 enemy = {cur: xcoordBlack, incr: randomV(700, 4000), yValue: randomV(0, 345), identifier: "destroyer" , width: widthBlack + 70 ,height: heightBlack + 30, health: 4, point:2  };
				} else {
		 enemy = {cur: xcoordBlack, incr: randomV(700, 4000), yValue: randomV(0, 375), identifier: "tie", width: widthBlack ,height: heightBlack, health: 2, point:1   };
				}
		enemy.cur += enemy.incr;
		arrayE[i] = enemy;
		sizeOfArray = arrayE.length;
		}
	}	  
}
function displayHealth() {
	for (var i = 0; i < health; i++) {
		var x = 20 + (20 * i) + (i*20);
	context.beginPath();
	context.arc(x, 20, 15, 0, 2 * Math.PI);
	context.fillStyle = "Red";
    context.fill();
		
	}
}	
function shootDS(){
	arrayFL.forEach(function(laser) {
    if 		(laser.yValue > shootY && laser.yValue < (shootY + 20) && laser.cur > shootX && laser.cur < (shootX + 100)) 
	
    {		
		explode.playbackRate = 4;
		explode.play();
		score = score + 10;
		var delet = arrayFL.indexOf(laser);
		arrayFL.splice(delet, 1);
		deathStar = false;
		return true;
  }
    else
    {
      return false;
    }
  });
}
function resetValues() {
		xcoord=100; //coordinates of user conrolled falcon
	 ycoord=100; //coordinates of user conrolled falcon 
	 health = 2; // health of Falcon
	 xLaser = 0;

	 arrayFL = [];
	 sizeOfArray = 0;
	xcoordBlack = 520; //coordinates of limit of 
	 ycoordBlack = 20; //coordinates of automatically moving red square
	 widthBlack = 25; //red square width 
	 heightBlack = 25; //red square height
	 nModEnemyX = 3; // x distance enemy is moved per iteration
	 iter = 0;
	 arrayE = [];    
	 created = false;
	 collected = false;
	//Death Star
	 dStarX = 1500;
	 dStarY = 200;
	 shootX = 0;
	 shootY = shootY-30;
	 gameOver = false;
	 deathStar = true;   //Array of Enemies
}

function animatePowerUp(){
	xcoordPowerUp = xcoordPowerUp - 10;
	context.fillStyle = "Orange"; // Sets fill style to black
		context.fillRect(xcoordPowerUp,ycoordPowerUp , 30, 20); //Draws black square
		checkCollisionPowerUp(); // check for collision Falcon

}
function createPowerUp() {
		xcoordPowerUp = randomV(700, 2000);
		ycoordPowerUp = randomV(0, 375);

}
function animateXWing() {
	if (inUse) {
		context.fillStyle = "Orange"; // Sets fill style to black
	   	context.fillRect(xcoord + 50, ycoord + 10, 25, 10); //Draws black square
	}	
}
function draw() {
  setTimeout(function() {
	  if (health > 0) {
    // key presses

		 if (space) {
			if (arrayFL.length <= 4) {
				xLaser = xcoord + 50
				var laser = {cur: xLaser, yValue: ycoord + 5, inc:0 };
				arrayFL.push(laser);
				xLaser = 0;
			}
		  }
		 if (xW) {
			if (arrayFL.length <= 4) {
				xLaser = xcoord + 50
				var laser = {cur: xLaser, yValue: ycoord + 5, inc:0 };
				arrayFL.push(laser);
				xLaser = 0;
				}
		  }
		 if (left) {
			xcoord = xcoord - FalcIncrement;
			if (xcoord < 0) {
				xcoord = 0;

			}
		}

		if (up){
			ycoord = ycoord - FalcIncrement;
			if (ycoord < 0) {
				ycoord = 0;
			}
		}

		if(right){
			xcoord = xcoord + FalcIncrement;
			if (xcoord > 770) {
				xcoord = 770;
			}
		}

		if (down){
			ycoord = ycoord + FalcIncrement;
			if (ycoord > 380) {
				ycoord = 380;
			}

		}
	  
	requestAnimationFrame(draw);
    context.clearRect(0, 0, canvas.width, canvas.height); // Clears canvas
	context.fillStyle = "Black";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.stroke();

	if (!created) {

		createEnemies();
		createPowerUp();
		created = true; 
	}	
	animateEnemies();
	if(arrayFL.length != 0){
	animateFalconLaser();
	}
	if (health > 0) {
    context.fillStyle = "#D3D3D3"; // Sets fill style to grey
    context.fillRect(xcoord,ycoord,30,20); // Draws Falcon
	displayHealth();
	}
	if (deathStar) {
		if (level == 1) {
			context.beginPath();
			context.arc(dStarX, dStarY, 150, 0, 2 * Math.PI);
			context.strokeStyle="Black";
			context.fillStyle = '#696969';

			context.fill();
			context.stroke();
			context.fillStyle = "#837a7a";
			shootX = dStarX-150;
			shootY = dStarY-5;
			
			context.fillRect(shootX,shootY , 75,20 );
			context.strokeStyle="Black";
			context.rect(dStarX-150, dStarY-5, 80,25 );
			context.stroke();
			
			context.beginPath();
			context.arc(dStarX-75, dStarY, 20, 0, 2 * Math.PI);
			dStarX -=5;
			context.strokeStyle="#65555";
			context.fillStyle = "#837a7a";
			context.fill();
			context.stroke();
		}
		if (level == 2) {
			context.beginPath();
			context.arc(dStarX, dStarY, 200, 0, 2 * Math.PI);
			context.strokeStyle="Black";
			context.fillStyle = '#696969';

			context.fill();
			context.stroke();
			context.fillStyle = "#837a7a";
			shootX = dStarX-150;
			shootY = dStarY-5;
			
			context.fillRect(shootX-50,shootY , 100,20 );
			context.strokeStyle="Black";
			context.rect(dStarX-200, dStarY-5, 100,25 );
			context.stroke();
			
			context.beginPath();
			context.arc(dStarX-75, dStarY, 30, 0, 2 * Math.PI);
			dStarX -=5;
			context.strokeStyle="#65555";
			context.fillStyle = "#837a7a";
			context.fill();
			context.stroke();
			if (!collected) {
				animatePowerUp();
			} else {
				animateXWing();
			}
		}
				if (dStarX < 800) {
			shootDS();
		}
	} 	 else if(level != 3) {
		level ++;
		resetValues();
	}
		if (level == 3) {
				context.beginPath();
				context.arc(dStarX, dStarY, 250, 0, 2 * Math.PI);
				context.strokeStyle="Black";
				context.fillStyle = '#444aa7';
				context.fill();
				context.stroke();
				context.beginPath();
				context.arc(dStarX-210, dStarY, 40, 0, 2 * Math.PI);
				dStarX -=5;
				context.fillStyle = "RED";
				context.fill();
				context.stroke();
				if (!collected) {
					animatePowerUp();
				} else {
					animateXWing();
				} 
		}

	//score print
	var scoreString = String(score);
	var scoreString = String(score);
	context.fillStyle = "White";
	context.font = "30px Comic Sans MS";
	context.fillText("Score: " + scoreString,600,30);
	  } 
	  if (health <= 0 || dStarX < 0) {
		  //GAME OVER SECTION
		  gameOver = true;
		    context.clearRect(0, 0, canvas.width, canvas.height); // Clears canvas
			context.fillStyle = "Black";
			context.fillRect(0, 0, canvas.width, canvas.height);
			var scoreString = String(score);
			var levelString = String(level);
			context.fillStyle = "Red";
			context.font = "50px Comic Sans MS";
			context.fillText("Mission Failed", 250, 200);
			context.fillStyle = "White";
			context.font = "30px Comic Sans MS";
			context.fillText("Level:" + levelString + " Score: " + scoreString,300,250);

	  }
	  if (!starkiller) {
		  						    context.clearRect(0, 0, canvas.width, canvas.height); // Clears canvas
			context.fillStyle = "Black";
			context.fillRect(0, 0, canvas.width, canvas.height);
			var scoreString = String(score);
			var levelString = String(level);
			context.fillStyle = "Green";
			context.font = "50px Comic Sans MS";
			context.fillText("Mission Completed", 250, 200);
			context.fillStyle = "White";
			context.font = "30px Comic Sans MS";
			context.fillText("Level:" + levelString + " Score: " + scoreString,300,250);
			}
	  
    }, 1000 / 60);
}

document.getElementById("playVideo").onclick = function() {vid.play();
};
document.getElementById("playGame").onclick = function() {
	if (gameOver) {
	level = 1;
	resetValues();
} else {
var parent = document.getElementById("body");
var child = document.getElementById("videoDiv");
parent.removeChild(child);
draw();}

};
//draw();

}
