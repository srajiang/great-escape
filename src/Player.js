import * as THREE from 'three';

function Player(game) {

  this.game = game;

  this.RT = .03;
  this.RB = .03;
  this.H = .08;
  this.col = 0xFFA631;

  // ---------------------------------movement vars
  this.moving = false;
  this.dir = 'R';
  this.id = null;

  this.pos = new THREE.Vector3(0, .125 ,-.4);
  this.finalPos;
  this.vel = new THREE.Vector3(0, 1, 0);
  this.grav = new THREE.Vector3(0, -9.8, 0);
  
  // ---------------------------------player state
  this.active = true;

  this.updatePos = ( dt ) => {
    if ( this.dir === 'R') {
      this.pos.z += .02;
    } else {
      this.pos.x += .02;
    }
    this.pos.y = this.pos.y + (this.vel.y * dt);
    this.vel.y = this.vel.y + (this.grav.y * dt);
  }
}


Player.prototype.checkBullsEye = (platform, player) => {
  const MARGIN = .03;
  let eye = platform.pos;

  let rangeX = {
    'max': (eye.x + MARGIN),
    'min': (eye.x - MARGIN)
  }
  let rangeZ = {
    'max': (eye.z + MARGIN),
    'min': (eye.z - MARGIN)
  }

  let myX = player.pos.x;
  let myZ = player.pos.z;

  if (myX < rangeX['max']  // bullseye!
    && myX > rangeX['min']
    && myZ < rangeZ['max']
    && myZ > rangeZ['min']
  ) {
    return 1;
  }
  return 0;
}

Player.prototype.landedSafelyOn = function(platform) {  

  let leewayMinX, leewayMaxX, myPosX, leewayMinZ, leewayMaxZ, myPosZ;

    myPosZ = this.pos.z 

    leewayMinZ = platform.pos.z - platform.W / 2 + .005;
    leewayMaxZ = platform.pos.z + platform.W / 2 - .005;
  
    myPosX = this.pos.x;
    leewayMinX = platform.pos.x - platform.W / 2 + .005;
    leewayMaxX = platform.pos.x + platform.W / 2 - .005;

  if (myPosX < leewayMinX || myPosX > leewayMaxX || myPosZ < leewayMinZ || myPosZ > leewayMaxZ || this.pos.y < 0 ) {
    return false; 
  } 
  return true;
  
}



export default Player;