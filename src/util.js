export const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

export const calculateScore = (currScore, currStreak) => {
  return currScore + Math.pow(2, currStreak);  
}


export const triggerBullsEyeFx = (ring) => {
  document.getElementById("land-bullseye").play(); //SOUND
  ring.opacity = 1;
};


export const toggleGameState = (playerIsDead, playerRestart) => {
  if (playerIsDead) {
    let gameover = document.getElementsByClassName("game-over-overlay")[0];
    let tryAgain = document.getElementsByClassName("try-again")[0];
    gameover.style.display = "block";
    tryAgain.style.display = "block";
  }

  if ( playerRestart ) {
    let gameover = document.getElementsByClassName("game-over-overlay")[0];
    let tryAgain = document.getElementsByClassName("try-again")[0];
    gameover.style.display = "none";
    tryAgain.style.display = "none";
  }
}

export const toggleAvatar = (playerDead) => {

  if (playerDead) {
    document.getElementById("croissant-sticker-lose").style.display = "block";
    document.getElementById("croissant-sticker-win").style.display = "none";
  } else {
    document.getElementById("croissant-sticker-lose").style.display = "none";
    document.getElementById("croissant-sticker-win").style.display = "block";
  }
}

export const toggleSound = (e) => {
  switch (e.target.id) {
    case 'volume-icon-on':
      e.target.style.display = 'none';
      document.getElementById("volume-icon-off").style.display = 'block';
      mutePage(true);
      break;
    case 'volume-icon-off':
      e.target.style.display = "none";
      document.getElementById("volume-icon-on").style.display = "block";
      document.getElementById("menu").play();      // SOUND
      mutePage(false);
      break;
  }
}

export const mutePage = (muted) => {
  document.querySelectorAll("audio").forEach(ele => (ele.muted = muted));

}