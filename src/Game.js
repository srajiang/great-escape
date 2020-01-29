import Player from './Player';
import Platform from './Platform';
import * as THREE from "three";

const PLATFORM_COUNT = 1;

function Game() {

  this.score = 0;
  this.streak = 0;
  this.APlatforms = this.addPlatforms(); // active platforms
  this.IPlatforms = this.addPlatforms();
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
    
    if (this.keyDelta > 3) {
      this.keyDelta = 3;
    }

    this.player.finalPos = new THREE.Vector3(this.player.pos.x, this.player.pos.y, this.player.pos.z + this.keyDelta)
    console.log('final pos is', this.player.finalPos);

    this.player.vel.y = this.keyDelta * 4;
    this.player.moving = true;

    clearTimeout();
  }


}

Game.prototype.addPlatforms = function() {

  if (this.APlatforms === undefined) {  //game start

    const start = new THREE.Vector3( 0, 0, -.4);
    const next = new THREE.Vector3(0, 0, 0);
    
    let platforms = [];
    let currPlat = true;
    let nextPlat = true;

    platforms.push(new Platform(true, currPlat, false, start));
    platforms.push(new Platform(true, false, nextPlat, next));

    console.log('curr', platforms[0].active, platforms[0].curr);
    console.log('next', platforms[1].active, platforms[1].next);
    
    return platforms;
    
  }


}

Game.prototype.checkLanding = function(platformPos, playerPos) {

  

}

export default Game;