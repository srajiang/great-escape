import init from './test';
import Game from './Game';


// ----------------------------------------------- GAME STATE VARIABLES
var currentGame = new Game();
console.log('game stats:', currentGame.score, currentGame.streak);
console.log(currentGame.isOver());

// --------------------------------------------------------- INIT GAME 
document.addEventListener('DOMContentLoaded', () => {
  init(currentGame);
  
})



// -------------------------------------------------- KEYBOARD ACTIONS
document.addEventListener('keydown', (e) => currentGame.registerSpaceBarKeyPress(e));
document.addEventListener('keyup', (e) => currentGame.registerSpaceBarKeyPress(e));


