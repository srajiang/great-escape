import Player from './Player';
import Platform from './Platform';
import PlatformQueue from './PlatformQueue';
import * as THREE from "three";

const LAUNCH_FACTOR = 4;
const HIGH_SCORE = 99999;

function Game() {

  this.score = 0;
  this.streak = 0;
  this.ActivePlatforms = this.addPlatforms(); // active platforms
  this.InactivePlatforms = new PlatformQueue();
  this.player = new Player(this);

  this.gameActive = false;

  this.keyDownTS;  //mouse event variables
  this.keyUpTS;
  this.keyDelta;
} 

Game.prototype.isOver = function() {
  return this.score > HIGH_SCORE; 
}

Game.prototype.setNextFinalPos = function() {
  if (this.dir === 'L') {
    this.player.finalPos = new THREE.Vector3(this.player.pos.x, .125, this.player.pos.z + this.keyDelta)
    
  } else {
    this.player.finalPos = new THREE.Vector3(this.player.pos.x + this.keyDelta, .125, this.player.pos.z)
  }
}

Game.prototype.registerSpaceBarKeyPress = function({ type, code, timeStamp }) {

  if (!this.gameActive) return;  //if the game is not active, spacebar doesn't trigger
  if (this.player.moving === true) return;   //if player is already moving, space bar doesn't trigger movement

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
    if (this.keyDelta > 2.5) { 
      this.keyDelta = 2.5;
    }
    if (this.keyDelta > 0.4) {
      document.getElementById("grunt-1").play(); // SOUND
    }
    this.setNextFinalPos();
    this.player.vel.y = this.keyDelta * LAUNCH_FACTOR;
    this.player.moving = true;
  }

}

Game.prototype.addPlatforms = function() {

  if (this.APlatforms === undefined) {  //game start
    const curr = new THREE.Vector3( 0, 0, -.4);
    const next = new THREE.Vector3(0, 0, 0);
    let platforms = new PlatformQueue;
    platforms.enQ(new Platform(true,  curr));
    platforms.enQ(new Platform(true, next));

    return platforms;
  
  }


}



export default Game;