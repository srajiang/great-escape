import * as math from 'mathjs';
import { sample } from './util';

function Player() {

  this.RT = .03;
  this.RB = .03;
  this.H = .08;
  this.col = 0xFFA631;

  // ---------------------------------movement vars
  this.moving = false;
  this.dir = null;

  this.pos = math.matrix([.3, -.275 ,-.1]);
  this.vel = math.matrix([0, .5, 1])
  this.grav = math.matrix([0, -1, -1])


  this.updatePos = ( dt ) => {

    console.log('before', this.pos);
    this.pos = math.add(this.pos, math.multiply(this.vel, dt));
    this.vel = math.add(this.vel, math.multiply(this.grav, dt));
    console.log('after', this.pos);

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