# Space Team

# Project Overview

## Project Schedule

This schedule will be used to keep track of your progress throughout the week and align with our expectations.  

|  Day | Deliverable | 
|---|---| 
|Day 1: Tue| Wireframes and Priority Matrix|
|Day 2: Wed| Project Approval /  Pseudocode / actual code|
|Day 3: Thur| Basic Clickable Model |
|Day 4: Fri| Working Prototype |
|Day 5: Sat| Final Working Project |
|Day 6: Sun| Bugs / Stylying / PostMVP |
|Day 7: Mon| Project Presentations |


## Project Description

Space-team is a game that already exists and I am going to try to emulate it using websockets and React native. Players will be able to visit the site, create a game, have their friends join, and then the team work begins. A scrolling marquee will display the current instructions and between the team you will need to carry out the instructions in order to move onto the next level.

## Wireframes
https://drive.google.com/file/d/1MGJTAo8EQ0dlcb92TjCzZvVDiYr0PWRZ/view?usp=sharing


## Priority Matrix
https://drive.google.com/file/d/1VLfsaohqW6zmZqfaANpzTPY1JnoOl7LL/view?usp=sharing

### Important - Lots of Time
 - Client-side websocket logic and parsing
 - Server-side websocket logic and parsing
 - Client-side rendering (learn React Native)
 - Game-flow logic

### Important - Not Much Time
 - Node server
 - Waiting Room
 - Landing page
 - Join game page

### Not Important - Not Much Time


### Not Important - Lots of Time
 - Making the game screens (pre-loaded, hardcoded gameplay panels)

## App Components

### Landing Page - The landing page will consist of two buttons... the create game button and the join game button. 

### Join Game Page -  will ask you to input your first name, game id, and then there will be a join button which will send you to the waiting room view.

### Create Game Page - will ask you how many players are playing with a cap of 4 total and then there will be a create game button which will send you to a log in room and display the game id at the top of the screen for you to share with your space-team. 

### Game Play screen - will consist of a scrolling marquee that will say the instructions, and a control panel that is predefined and hard-code but selected at random. (the layouts will be pre-made and randomly select to the user)

### Game Win/Lose condition - Game win will be don't die for 5 minutes. Game lose will be get too many missed instructions in comparison to completed instructions.

## MVP 
MVP will be a single 5-minute level that up to 4 players will be able to play on.

## POST MVP
Post MVP, I think I'll try to throw in complications into the game to make it more difficult. Perhaps shorten the levels and just add lots of lvels which each new level bringing in a complication this upping the difficulty.

## Functional Components


| Component | Priority | Estimated Time | Actual Time |
| --- | :---: |  :---: | :---: |
| client-side websocket | H | 10hrs |  |
| server-side websocket | H | 10hrs |  |
| client-side game rendering | H | 12hrs |  |
| learn react-native | H | ?hrs |  |
| node/express server | H | 1hr |  |
| waiting room | M | 1hr |  |
| landing page | M | 2hrs |  |
| join game | H | 1hr |  |
| Total |  | 37hrs |  |

## Helper Functions



## Code Snippet


## Issues and Resolutions


