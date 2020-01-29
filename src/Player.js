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

Player.prototype.isOffPlatform = () => {
  return false;
  // needs to check that the player object is not on the same platform as the box

}


export default Player;