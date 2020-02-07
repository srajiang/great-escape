
# Great Croissant Escape <img width="450" align="right" alt="Screen Shot 2020-02-02 at 10 50 46 PM" src="https://user-images.githubusercontent.com/55667998/73631661-81d61980-460e-11ea-9773-4b7402efa436.png">

### [Live](https://srajiang.github.io/great-escape/dist/)

You are a little croissant trying to escape the bakery. Get points for leaping successfully on pastry boxes in a bid for your freedom. Don't fall off the boxes or risk being eaten by a hungry human! 


## Background

A popular WeChat mini program game called Jump Jump took the world by storm last year and is frustrating, delightful and addictive. It is itself a copy of the game "Bottleflip" by the French gamemakers Ketchapp, a testament to how a simple game premise and some delightful mechanics can be endlessly reinvented and enjoyed. I wanted to see what it takes to make a delightful game play experience so I built a game which shares a similar mechanic.  

Original Jump Jump (Tiao Yi Tiao) 
https://www.youtube.com/watch?v=Ee3IOH-ILuI

The premise of the game is fairly simple, the user holds their finger/mouse on the screen to "launch" the figurine and make them jump from platform to platform. You accrue points as you jump, and get more points if you launch yourself right onto the center of the platform. You win when you reach the end of the platforms (i.e. a score of 99999) and you lose when you fall off any of the platforms.

This game features:

* Smooth visual style, elements appearing in the view in an isometric view. 
* Sound elements that reinforce the reward of landing on the mark (i.e. right on the center of the platform).
* Delightful physics of launching the character, the flip, and the landing.
* Randomly generated boxes with varying difficulties of player action required to land a jump successfully based on the camera position, distance, and the player's own starting velocity. 

## Game Stills

<p align="center">
   <img height="350" alt="Screen Shot 2020-02-02 at 10 45 19 PM" src="https://user-images.githubusercontent.com/55667998/73631436-cf9e5200-460d-11ea-9213-92869e140b4e.png">
   <img height="350" alt="Screen Shot 2020-02-02 at 10 47 23 PM" src="https://user-images.githubusercontent.com/55667998/73631498-01171d80-460e-11ea-9904-2a85bb2963ae.png">
   <img height="350" alt="Screen Shot 2020-01-31 at 7 15 39 PM" src="https://user-images.githubusercontent.com/55667998/73618617-b41b5300-45dd-11ea-924f-e1a922419209.png">
</p>

### Technologies / Features

#### Smooth visual style
* Modern minimal design aesthetic.
* Built with vanilla Javascript and vanilla DOM manipulation in conjunction with Three.js / WEBGL canvas

#### Sound elements which enhance gameplay 
* There are non-intrusive sound effects accompanying launch, landing, and hitting the bullseye as a user. 
* From a user-experience standpoint, I have also included and option for the user to disable sound / audio throughout the game


## Game Components
   
* Game
   * Tracks a score with a max 99,999. On successful land total score = Prev Score + ( 2^f ), where f is the streak value. 
   * Tracks a streak Streak, no max. +1 when user leaps to center of a platform. Resets on all other cases.
   
* Orthographic Camera
   * Positioned so as to give an isometric view of the game scene. 
   * See example here: 
<p align="center">
<img width="596" alt="Screen Shot 2020-01-27 at 10 14 25 AM" src="https://user-images.githubusercontent.com/55667998/73203685-617bfb80-40f2-11ea-8a4b-d48631ad927e.png">
</p>
     
* Platform
  * Variables
    * Geometry: H, W, D 
    * Position (X, Y, Z), i.e. from scene origin at (0,0,0) 
* Player
   * CalculateNewPos - takes a prev X<sup>0</sup> and a Velocity and calculates a new final position. 
   * landedSafelyOn: Compares position of the player to the platform. 
      * Vars 
         * DeltaT - time passed between re-renders / updates to the frame
         * Velocity - determined by the user on mouse-down
         * Gravity - Gravity vector 
      * Formulas for jump action: 
         * Update position: J<sup>1</sup> = J + DeltaT * Velocity (every frame position changes)
         * Update velocity: V<sup>1</sup> = V + DeltaT * Gravity  (every frame velocity changes)    
         

## UI Components

* All 3D game assets rendered in three.js. Three.js is a cross-browser JavaScript library and Application Programming Interface (API) used to create and display animated 3D computer graphics in a web browser. Three.js uses WebGL. 
* Sound Assets - FreeSound.com
* Credit to [CupcakeJuice](https://www.deviantart.com/cupcakejuice/art/Cute-Croissant-194136322) for the basis of my "Frenchified croissant" avatar. 
* Credit to Anastasia Shedu ([3D - modeler](https://sketchfab.com/Anastasia.Shedu)) for the low-poly croissant model used in this game.




