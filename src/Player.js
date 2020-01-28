function Player() {

  this.RT = .03;
  this.RB = .03;
  this.H = .08;
  this.col = 0xFFA631;
  this.X = .3;
  this.Y = -.275;
  this.Z = -.1;

}

Player.prototype.isOffPlatform = () => {
  return false;
  // needs to check that the player object is not on the same platform as the box

}

export default Player;