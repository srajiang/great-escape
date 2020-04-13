import { sample } from './util'; 
import * as THREE from "three";


// ---------------------------------------------------------- PLATFORM CONSTANTS

const COLORS = [
  0xf95f7b,
  0x3ff9d7,
  0x6c8dff,
  0x67e0f0,
  0xffb800,
  0x956cff,
  0xfa7286,
  0xffa500
];
const OBJ_SIZES = [1.45, 1.5, 1.8, 2, 2, 2.8, 2.8, 2.8, 2.8];
const HEIGHT = .15;
const DEFAULT_POS = new THREE.Vector3(0,0,0)

// ---------------------------------------------------------- INITIAL OBJ CONSTS

function Platform( active = false, initPos = DEFAULT_POS ) { 

  this.inView = active;  //state wrt camera

  this.WIDTH_DEPTH = sample(OBJ_SIZES) / 10;
  this.H = HEIGHT;      // platform dimensions
  this.W = this.WIDTH_DEPTH;
  this.D = this.WIDTH_DEPTH;
  this.col = sample(COLORS);
  this.pos = initPos;

  this.id = null;

}

Platform.prototype.setPos = ( playerPos ) => {
  //takes a player position and then generates a platform XYZ based on the player pos]

  // check the player position
  // check my own size
  // determine position based on those two things,
  // randomize whether the movement will be to the right or left 

}


export default Platform