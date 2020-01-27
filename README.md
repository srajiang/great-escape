# Great Bento Escape

You are a little tamago roll trying to escape the bento. Don't fall off the sushi platters and get points for leaping successfuly to freedom. 

## Background

A popular WeChat mini program game called Jump Jump became very popular earlier this year and is frustrating, delightful and addictive. I wanted to see what it takes to make a truly delightful game play experience so I built a game which shares a similar mechanic.  

Original Jump Jump (Tiao Yi Tiao) 
https://www.youtube.com/watch?v=Ee3IOH-ILuI

The premise of the game is fairly simple, the user holds their finger/mouse on the screen to "launch" the figurine and make them jump from platform to platform. You accrue points as you jump, and get more points if you launch yourself right onto the center of the platform. You win when you reach the end of the platforms (i.e. a score of 99999) and you lose when you fall off any of the platforms.

This game features:

* Smooth visual style, elements appearing in the view in an isometric pattern. 
* Background color gradient change over time as you progress through the game. 
* Sound elements that reinforce the reward of landing on the mark (i.e. right on the center of the platform).
* Delightful physics of launching the character, the flip, and the landing.

## Game Components

* GameManager
  * Variables
      * Score, with a max 99,999
      * Streak, no max. +1 when user leaps to center of a platform. Resets on all other cases
  * Functions
      * Starts and ends the game
      * Adds to the score on successful land Total score = Prev Score + ( 2^f ), where f is the streak value. 
* Platform
  * Variables
    * X, Y, X - axonometric variables where Y is perpendicular to the horizontal plane and X and Y are 30° from horizonal plane
  * Functions
    
   


