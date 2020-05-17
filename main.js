/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

//let startTime = Date.now();
//const SECONDS_PER_ROUND = 5;
//let elapsedTime = 0;
let time = 15
let score = 0

let historyScore = []

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";

  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero.png"

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.jpg";
}

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
let update = function () {
  // Update the time.
  //elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  if (38 in keysDown && time > 0) {heroY -= 5}
  else {heroY -= 0}
  if (40 in keysDown && time > 0) {heroY += 5}
  else {heroY += 0}
  if (37 in keysDown && time > 0) {heroX -= 5}
  else {heroY -= 0}
  if (39 in keysDown && time > 0) {heroX += 5}
  else {heroY += 0}

  if(heroX < 0){
    heroX = canvas.width - 32
  }else if(heroX > canvas.width - 32){
    heroX = 0
  }

  if(heroY < 0){
    heroY = canvas.height - 32
  }else if(heroY > canvas.height - 32){
    heroY = 0
  }
  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= (monsterX + 32)
    && monsterX <= (heroX + 32)
    && heroY <= (monsterY + 32)
    && monsterY <= (heroY + 32)
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    monsterX = Math.floor(Math.random()*(canvas.width-32))
    monsterY = Math.floor(Math.random()*(canvas.height-32)) 

    score++

  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0)
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY)
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY)
  }
  document.getElementById("userscore").innerHTML = `Your Score: ${score}`
}

function signUp(){
  let userName = document.getElementById("username").value
  document.getElementById('username').value = ""
  document.getElementById("usernamearea").innerHTML = `Hello Doctor ${userName}`
}
signUp()

function timeCounting(){
  myTime = setInterval(() => {
      time -= 1
      document.getElementById("timeleft").innerHTML = `Time left: ${time} second`
      if(time < 0){
        document.getElementById("timeleft").innerHTML = "Time Over!"
        timeOut() 
        historyScore.push(score)
        document.getElementById("historyscorearea").innerHTML = `History: ${historyScore}`
          
        let bestScore = Math.max(...historyScore)
        document.getElementById("bestscore").innerHTML = `Best Score: ${bestScore}`
      }
  }, 1000)// every 1 second, it will add 1 into time variable (computer use millisecond so 1000 is 1 second)
}
timeCounting()

function timeOut() {
  clearInterval(myTime)
}

function reset(){
  document.getElementById("usernamearea").innerHTML = `Hello Doctor ${""}`
  timeOut()
  time = 15
  document.getElementById("timeleft").innerHTML = `Time left: ${time} second`
  timeCounting()
  score = 0
  document.getElementById("userscore").innerHTML = `Your score: ${""}`
  
  heroX = canvas.width / 2;
  heroY = canvas.height / 2;

  monsterX = 100;
  monsterY = 100;
}
reset()



/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update()
  render()
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
  document.getElementById("resetbutton").disabled = true
  if(time < 0){
    document.getElementById("resetbutton").disabled = false
  }
}

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!

loadImages()
setupKeyboardListeners()
main()

