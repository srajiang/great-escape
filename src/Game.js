import Player from './Player';
import Platform from './Platform';
import * as math from "mathjs";


const PLATFORM_COUNT = 1;

function Game() {

  this.score = 0;
  this.streak = 0;
  this.platforms = this.addPlatforms(); // testing a single platform
  this.player = new Player();

  this.gameStarted = false;

  this.keyDownTS;  //mouse event variables
  this.keyUpTS;
  this.keyDelta;
} 

Game.prototype.isOver = function() {
  return this.score > 99998 || this.player.isOffPlatform() 
}


Game.prototype.registerSpaceBarKeyPress = function({ type, code, timeStamp }) {

  if (code === "Space" && !this.gameStarted) {   //starts the game on initial spacebar keypress
   
    this.gameStarted = true;

  }

  if (this.keyDownTS && this.keyUpTS && this.keyDelta) {  //reset if already exist
    this.keyDownTS = undefined;
    this.keyUpTS = undefined;
    this.keyDelta = undefined;
  }

  if (type === "keydown" && code === "Space" && !this.keyDownTS) {
    this.keyDownTS = timeStamp;
  }

  if (type === "keyup" && code === "Space" && !this.keyUpTS) {

    this.keyUpTS = timeStamp;
  }

  if (this.keyDownTS && this.keyUpTS) {  //player has made a move
    this.keyDelta = (this.keyUpTS - this.keyDownTS) / 1000; //convert to s;
    console.log('velocity:', this.keyDelta);

    //updates the Player object to trigger motion of the player piece
    this.player.dir = this.player.getRandomDir();
    this.player.vel = math.matrix([0, this.keyDelta, 1]);;
    this.player.moving = true;

    setTimeout(() => { //test 
      this.player.moving = false;
    }, 1000)
   
    clearTimeout();
  }


}

Game.prototype.addPlatforms = function() {

  let platforms = [];


  for (let i = 0; i < PLATFORM_COUNT; i++ ) {

    platforms.push( new Platform());

  }
  //makes a 8 PlatformObjects and returns them as an array to the main Game object
  return platforms;
}

export default Game;