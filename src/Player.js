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
  this.dir = null;

  this.pos = new THREE.Vector3(0, .115 ,-.4);
  this.finalPos;
  this.vel = new THREE.Vector3(0, 1, 0);
  this.grav = new THREE.Vector3(0, -9.8, 0);


  this.updatePos = ( dt ) => {

    // console.log('before', this.pos);

    // this.pos = math.add(this.pos, math.multiply(this.vel, dt));
    this.pos.z += .02;

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

Player.prototype.landedSafely = function( platform ) {  

  //needs to be refactored to account for shift in X as well as Z

  let dd;

  if ( platform.pos.z < 0) {
    dd = platform.pos.z - this.pos.z;
  } else {
    dd = Math.abs(platform.pos.z - this.pos.z);
  }
  console.log('dd', dd);
  console.log('platform z', platform.pos.z);
  let leeway = platform.pos.z + platform.W / 2 - .005 ;

  console.log('leeway', leeway);
  
  if (dd < 0.000000001) {   //hit center

    console.log('Bullseye!!')
    return true;

  } else if(dd  > leeway) {
    return false; 
  } 

  return true;
  
};

Player.prototype.stayedOnPlatform = function( platform ) {



}


export default Player;