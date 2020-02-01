import init from './init';
import Game from './Game';


// ----------------------------------------------- GAME STATE VARIABLES
var game = new Game();
console.log('game stats:', game.score, game.streak);
console.log(game.isOver());

// --------------------------------------------------------- INIT GAME 
document.addEventListener('DOMContentLoaded', () => {
  init(game);
  

  // -------------------------------------------------- KEYBOARD ACTIONS
  document.addEventListener('keydown', (e) => game.registerSpaceBarKeyPress(e));
  document.addEventListener('keyup', (e) => game.registerSpaceBarKeyPress(e));

})



