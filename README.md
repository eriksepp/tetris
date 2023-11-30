# Make your game - Scoreboard

The goal for this task was to create a game using only plain JavaScript and HTML 
(usage of frameworks and canvas was not allowed) and implement also a scoreboard
which would run in Go server and store the scoreboard in JSON file.

# Authors

Olena Budarahina (obudarah)  
Erik Hans Sepp (ehspp)

# Usage

This project uses the Gorilla WebSocket package for handling WebSocket connections.
Ensure you have this package installed before attempting to run the server.
For installation run the following command in your terminal:

`go get github.com/gorilla/websocket`

If you have the Gorilla Websocket installed run the Go server with:

`go run . `

# Rules

The goal of the game is to clear lines using falling 
tetrominoes as in standard Tetris rules.
Every 10 lines cleared levels up the game, making tetrominoes fall 
faster.  
As the task included also to implement lives system, the game starts with 3 lives.
If no line is completed in 25 seconds, players loses
one heart. Losing all hearts ends the game.

# Scoring 

Player gets points by the amount of lines cleared at once and the current level:

|Completed lines|Points|
|:---:|:---:|
|1|100 x Level|
|2|300 x Level|
|3|500 x Level|
|4|800 x Level|