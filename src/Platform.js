import { sample } from './util'; 
import * as THREE from "three";


// ---------------------------------------------------------- PLATFORM CONSTANTS

const COLORS = [0xF95F7B, 0x3FF9D7, 0x6C8DFF, 0x67E0F0, 0xDEDEDE, 0xFFB800];
const OBJ_SIZES = [1, 1.35, 1.5, 2, 2, 2.8, 2.8];
const WIDTH_DEPTH = sample(OBJ_SIZES) / 10; 
const HEIGHT = .15;
const DEFAULT_POS = new THREE.Vector3(0,0,0)

// ---------------------------------------------------------- INITIAL OBJ CONSTS
// const START_POS = new THREE.Vector3(0, 0.075, 0);


function Platform( active = false, initPos = DEFAULT_POS ) { 

  this.inView = active;  //state wrt camera

  this.H = HEIGHT;      // platform dimensions
  this.W = WIDTH_DEPTH;
  this.D = WIDTH_DEPTH;
  this.col = sample(COLORS);
  this.pos = initPos;
  // this.X = initPos.x;
  // this.Y = initPos.y;
  // this.Z = initPos.z;

}

Platform.prototype.setPos = ( playerPos ) => {
  //takes a player position and then generates a platform XYZ based on the player pos]

  // check the player position
  // check my own size
  // determine position based on those two things,
  // randomize whether the movement will be to the right or left 

}


export default Platform