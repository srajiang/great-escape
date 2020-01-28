import init from './test';
import Game from './Game';


// ----------------------------------------------- GAME STATE VARIABLES
var game = new Game();
console.log('game stats:', game.score, game.streak);
console.log(game.isOver());

// --------------------------------------------------------- INIT GAME 
document.addEventListener('DOMContentLoaded', () => {
  init(game);
  
})

// -------------------------------------------------- KEYBOARD ACTIONS
document.addEventListener('keydown', (e) => currentGame.registerSpaceBarKeyPress(e));
document.addEventListener('keyup', (e) => currentGame.registerSpaceBarKeyPress(e));


