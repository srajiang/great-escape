import * as math from 'mathjs';
import { sample } from './util';
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

  this.pos = new THREE.Vector3(0, .115 ,-.4);
  this.finalPos;
  this.vel = new THREE.Vector3(0, 1, 0);
  this.grav = new THREE.Vector3(0, -9.8, 0);


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


Player.prototype.checkBullsEye = function () {

  const MARGIN = .05;

  let next = this.game .APlatforms.next()
  let eye = next.pos;
  eye.y += ( next.H / 2 );

  let rangeX = { 
    'max': (eye.x + MARGIN), 
    'min': (eye.x - MARGIN)
  } 
  let rangeZ = {
    'max': (eye.z + MARGIN),
    'min': (eye.z - MARGIN)
  } 

  let myX = this.pos.x;
  let myZ = this.pos.z;

  if (myX < rangeX['max'] 
    && myX > rangeX['min']
    && myZ < rangeZ['max'] 
    && myZ > rangeZ['min']
) {
  console.log('BULLSEYE!!!');
  this.game.streak += 1;
  console.log('streak', this.game.streak);
  return true;
}  
  console.log('my pos', this.pos);
}

Player.prototype.landedSafelyOnNext = function( platform ) {  

  let dd, leeway, leewayMin, leewayMax, myPos;
  if ( this.dir === 'R') {
    myPos = this.pos.z 

    leewayMin = platform.pos.z - platform.W / 2 - .005;
    leewayMax = platform.pos.z + platform.W / 2 - .005;
  
  } else {

    myPos = this.pos.x;
    leewayMin = platform.pos.x - platform.W / 2 - .005;
    leewayMax = platform.pos.x + platform.W / 2 - .005;

    // console.log('platform pos x',  platform.pos.x);
    // console.log('player position x', this.pos.x);
    // console.log('leeway', leeway);
    // console.log('leeway min', leewayMin);
    // console.log('leeway max', leewayMax);
    // console.log('delta d', dd);
  }
  
  // this.checkBullsEye();

  if(myPos < leewayMin || myPos > leewayMax || dd < leeway ) {
    return false; 
  } 
  return true;
  
}

Player.prototype.landedSafelyOnCurr = function( platform ) {

  return false; 

}

Player.prototype.calcNextPos = function() {



}




export default Player;