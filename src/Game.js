import Player from './Player';
import Platform from './Platform';

function Game() {

  this.score = 0;
  this.streak = 0;
  this.platform = new Platform(); // testing a single platform
  this.player = new Player();

  this.keyDownTS = undefined;
  this.keyUpTS = undefined;
  this.keyDelta = undefined;
}

Game.prototype.isOver = function() {
  return this.score > 99998 || this.player.isOffPlatform() 
}

Game.prototype.registerSpaceBarKeyPress = function({ type, code, timeStamp }) {

  if (this.keyDownTS && this.keyUpTS && this.keyDelta) {  //reset if already exist
    this.keyDownTS = undefined;
    this.keyUpTS = undefined;
    this.keyDelta = undefined;
  }

  if (type === "keydown" && code === "Space" && !this.keyDownTS) {
    this.keyDownTS = timeStamp;
    console.log('keydownTS', this.keyDownTS);
  }

  if (type === "keyup" && code === "Space" && !this.keyUpTS) {

    this.keyUpTS = timeStamp;
    console.log('keyupTS', this.keyUpTS);
  }

  if (this.keyDownTS && this.keyUpTS) {
    this.keyDelta = (this.keyUpTS - this.keyDownTS) / 1000; //convert to seconds;
    console.log('key delta', this.keyDelta);
  }

  //eventually this will update the Player object by triggering the motion of the player piece

}

Game.prototype.addPlatforms = function() {

  //makes a 8 PlatformObjects and returns them as an array to the main Game object

}

export default Game;