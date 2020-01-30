import * as math from 'mathjs';
import { sample } from './util';
import * as THREE from 'three';

function Player() {

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
    // this.vel = this.vel.add(this.grav.multiplyScalar(dt));

    // this.vel = this.vel + (this.grav * dt); 
    // this.vel = math.add(this.vel, math.multiply(this.grav, dt));
    // console.log('after', this.pos);
  }
}

Player.prototype.getRandomDir = () => {

  let dirs = ['L','R'];
  console.log('DIRS', dirs);
  return sample(dirs);

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
  
  if (dd < 0.000000001) {   //hit center

    console.log('Bullseye!!')
    return true;

  } else if(myPos < leewayMin || myPos > leewayMax || dd < leeway ) {
    return false; 
  } 

  return true;
  
};

Player.prototype.landedSafelyOnCurr = function( platform ) {

  return false; 

}

Player.prototype.calcNextPos = function() {



}


export default Player;