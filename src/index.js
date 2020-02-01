import init from './init';
import Game from './Game';
import { toggleGameState } from './util';


// ----------------------------------------------- GAME STATE VARIABLES
var game = new Game();
console.log('game stats:', game.score, game.streak);

// --------------------------------------------------------- INIT GAME 
document.addEventListener('DOMContentLoaded', () => {
  init(game);
  
  // -------------------------------------------------- KEYBOARD ACTIONS
  document.addEventListener('keydown', (e) => game.registerSpaceBarKeyPress(e));
  document.addEventListener('keyup', (e) => game.registerSpaceBarKeyPress(e));


  // ------------------------------------------------------ RESTART GAME
  document.getElementsByClassName('try-again')[0].addEventListener("click", function() {
    
    document.getElementById('eaten').pause();
    toggleGameState(false, true);
    game = new Game();
    document.getElementById("score").innerHTML = game.score;
    init(game);

  })

})



