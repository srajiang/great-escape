import Player from './Player';
import Platform from './Platform';
import PlatformQueue from './PlatformQueue';
import * as THREE from "three";

const LAUNCH_FACTOR = 4;

function Game() {

  this.score = 0;
  this.streak = 0;
  this.APlatforms = this.addPlatforms(); // active platforms
  this.IPlatforms = new PlatformQueue();
  this.player = new Player(this);

  this.gameStarted = false;

  this.keyDownTS;  //mouse event variables
  this.keyUpTS;
  this.keyDelta;
} 

Game.prototype.isOver = function() {
  return this.score > 99998 
}

Game.prototype.setNextFinalPos = function() {
  if (this.dir === 'L') {
    this.player.finalPos = new THREE.Vector3(this.player.pos.x, this.player.pos.y, this.player.pos.z + this.keyDelta)
    
  } else {
    this.player.finalPos = new THREE.Vector3(this.player.pos.x + this.keyDelta, this.player.pos.y, this.player.pos.z)
  }
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
    
    if (this.keyDelta > 3) {
      this.keyDelta = 3;
    }

    // this.player.finalPos = new THREE.Vector3(this.player.pos.x, this.player.pos.y, this.player.pos.z + this.keyDelta)
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