import init from './init';
import Game from './Game';
import { toggleGameState, toggleAvatar, toggleSound } from './util';

// ------------------------------------------------------------------- INIT GAME 
var game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  init(game);

  document.getElementsByClassName('start-game')[0].addEventListener('click', function() {
    game.gameActive = true;
    document.getElementsByClassName('game-start-overlay')[0].style.display = 'none';
    document.getElementsByClassName('start-game')[0].style.display = 'none';
  })

  // ---------------------------------------------------------- KEYBOARD ACTIONS
  document.addEventListener('keydown', (e) => game.registerSpaceBarKeyPress(e));
  document.addEventListener('keyup', (e) => game.registerSpaceBarKeyPress(e));
    
  // ------------------------------------------------------------ VOLUME CONTROL
  let soundToggle = document.getElementById('volume-icon');
  soundToggle.addEventListener('click', (e) => toggleSound(e));


  // -------------------------------------------------------------- RESTART GAME
  document.getElementsByClassName('try-again')[0].addEventListener("click", function() {
    console.log('restarting');
    document.getElementById('eaten').pause();
    toggleGameState(false, true);
    game = new Game();
    game.gameActive = true;
    document.getElementById("score").innerHTML = game.score;
    toggleAvatar(game.player.dead);
    init(game);
  })
})



