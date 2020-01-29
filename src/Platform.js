import { sample } from './util'; 

// ---------------------------------------------------------- PLATFORM CONSTANTS

const COLORS = [0xF95F7B, 0x3FF9D7, 0x6C8DFF, 0x67E0F0, 0xDEDEDE, 0xFFB800];
const OBJ_SIZES = [1, 1.35, 1.5, 2, 2, 2.8, 2.8];
const WIDTH_DEPTH = sample(OBJ_SIZES) / 10; 
const HEIGHT = .15;
const Y = -.5

// ---------------------------------------------------------- INITIAL OBJ CONSTS
const START_POS = [.4, Y, 0];


function Platform() { 

  this.H = HEIGHT;
  this.W = WIDTH_DEPTH;
  this.D = WIDTH_DEPTH;
  this.col = sample(COLORS);
  this.X = START_POS[0];
  this.Y = START_POS[1];
  this.Z = START_POS[2];

  // this needs to be eventually set by the player position
  // this.X = null;
  // this.Y = null;
  // this.Z = null;

}

Platform.prototype.setPos = ( playerPos ) => {
  //takes a player position and then generates a platform XYZ based on the player pos]

  // check the player position
  // check my own size
  // determine position based on those two things,
  // randomize whether the movement will be to the right or left 

}


export default Platform