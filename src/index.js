import init from './init';
import Game from './Game';
import { toggleGameState, toggleAvatar, toggleSound } from './util';

// -------------------------------------------------------- GAME STATE VARIABLES
var game = new Game();

// ------------------------------------------------------------------- INIT GAME 
document.addEventListener('DOMContentLoaded', () => {
  init(game);

  // ---------------------------------------------------------- KEYBOARD ACTIONS
  document.addEventListener('keydown', (e) => game.registerSpaceBarKeyPress(e));
  document.addEventListener('keyup', (e) => game.registerSpaceBarKeyPress(e));
  
  // ------------------------------------------------------------ VOLUME CONTROL

  let soundToggle = document.getElementById('volume-icon');
  soundToggle.addEventListener('click', (e) => toggleSound(e));

  // ---------------------------------------------------------------- START GAME

  document.getElementsByClassName('start-game')[0].addEventListener('click', function() {
    document.getElementsByClassName('game-start-overlay')[0].style.display = 'none';
    document.getElementsByClassName('start-game')[0].style.display = 'none';
  })

  // -------------------------------------------------------------- RESTART GAME
  document.getElementsByClassName('try-again')[0].addEventListener("click", function() {
    document.getElementById('eaten').pause();
    toggleGameState(false, true);
    game = new Game();
    document.getElementById("score").innerHTML = game.score;
    toggleAvatar(game.player.dead);
    init(game);
  })
})



