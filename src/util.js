export const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

export const calculateScore = (currScore, currStreak) => {
  return currScore + Math.pow(2, currStreak);  
}

export const checkBullsEye = (platform, player) => {

  const MARGIN = .01;
  let eye = platform.pos;

  let rangeX = {
    'max': (eye.x + MARGIN),
    'min': (eye.x - MARGIN)
  }
  let rangeZ = {
    'max': (eye.z + MARGIN),
    'min': (eye.z - MARGIN)
  }

  let myX = player.pos.x;
  let myZ = player.pos.z;

  // console.log('rangeX', rangeX);
  // console.log('rangeZ', rangeZ);
  // console.log('myX', myX);
  // console.log('myZ', myZ);

  if (myX < rangeX['max']
    && myX > rangeX['min']
    && myZ < rangeZ['max']
    && myZ > rangeZ['min']
  ) {

    document.getElementById("land-bullseye").play(); //SOUND
    return 1;
  }
  return 0;  

}

export const toggleGameState = (playerIsDead, playerRestart) => {

  if ( playerIsDead) {

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