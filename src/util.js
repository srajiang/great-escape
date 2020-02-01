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

    document.getElementById("land-bullseye").play(); //play bullseye sound
    return 1;
  }
  return 0;  

}