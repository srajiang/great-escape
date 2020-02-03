
# Great Croissant Escape

You are little croissant trying to escape the bakery. Get points for leaping successfully on pastry boxes in a bid for your freedom. Don't fall off the boxes or risk being eaten! 


## Background

A popular WeChat mini program game called Jump Jump took the world by storm last year and is frustrating, delightful and addictive. It is itself a copy of the game "Bottleflip" by the French gamemakers Ketchapp, a testament to how a simple game premise and some delightful mechanics can be endlessly reinvented and enjoyed. I wanted to see what it takes to make a delightful game play experience so I built a game which shares a similar mechanic.  

Original Jump Jump (Tiao Yi Tiao) 
https://www.youtube.com/watch?v=Ee3IOH-ILuI

The premise of the game is fairly simple, the user holds their finger/mouse on the screen to "launch" the figurine and make them jump from platform to platform. You accrue points as you jump, and get more points if you launch yourself right onto the center of the platform. You win when you reach the end of the platforms (i.e. a score of 99999) and you lose when you fall off any of the platforms.

This game features:

* Smooth visual style, elements appearing in the view in an isometric pattern. 
* Sound elements that reinforce the reward of landing on the mark (i.e. right on the center of the platform).
* Delightful physics of launching the character, the flip, and the landing.
* Randomly generated boxes with varying difficulties of player action required to land a jump successfully based on the camera position, distance, and the player's own starting velocity. 

## Game Stills

<p align="center">
   <img height="400" alt="Screen Shot 2020-02-02 at 4 22 31 PM" src="https://user-images.githubusercontent.com/55667998/73618634-d7de9900-45dd-11ea-8d5a-5dab155fbb5b.png">
   <img height="400" alt="Screen Shot 2020-01-31 at 7 15 39 PM" src="https://user-images.githubusercontent.com/55667998/73618617-b41b5300-45dd-11ea-924f-e1a922419209.png">
</p>



## Game Components
   
* Game
  * Variables
      * TotalScore, with a max 99,999
      * Streak, no max. +1 when user leaps to center of a platform. Resets on all other cases
  * Functions
      * Starts and ends the game
      * Adds to the score on successful land total score = Prev Score + ( 2^f ), where f is the streak value. 
     
* Object (Parent) 
  * Variables
    * H, W, D - axonometric variables where H is perpendicular to the horizontal plane and W and D are 30° from horizonal plane
    * Position (X, Y) - Position of the center of the flat part of the box on the game canvas. 
  * Functions
    * TBD
  * See example here: 
<img width="596" alt="Screen Shot 2020-01-27 at 10 14 25 AM" src="https://user-images.githubusercontent.com/55667998/73203685-617bfb80-40f2-11ea-8a4b-d48631ad927e.png">
 
* Jumper (inherits from Object)
  * Functions
    * CalculateNewPos - takes a prev X<sup>0</sup> and a Velocity and calculates a new position. 
    * Jump - Takes a prev X<sup>0</sup>, Y<sup>0</sup> and a New X<sup>1</sup>, Y<sup>1</sup> and updates the game to have the figure travel along a curved path from the former to the latter. TBD How conversion from cartesian system to the isometric projection will impact the following formulas:  
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




