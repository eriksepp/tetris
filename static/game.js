import { tetrominoesData } from "./initData.js";
import { Tetromino } from "./tetrominoClass.js";
import { gamebox } from "./gameBox.js"
import { gameStatus, pauseResumeToggle, restartGame, gameOver, updateMainTimer, pickAndShowNextTetromino, calculateFPS, submitScore, nameInputEventListener } from "./gameStatusHandler.js"
import { prevScoresPage, nextScoresPage } from "./scoreboardHandler.js";
import { startWebSocket } from "./websocket.js"

/*----------------------------------------------------------------*/

window.addEventListener("DOMContentLoaded", function () {
    startWebSocket();
    document.getElementById("startButton").focus();
    buttonListener("startButton", startGame);
    buttonListener("pauseButton", pauseGame);
    buttonListener("restartButton", renewGame);
    buttonListener("leftNavBtn", prevScoresPage);
    buttonListener("rightNavBtn", nextScoresPage);
    buttonListener("submitScoreButton", submitScore);
    nameInputEventListener();
});

/*----------------------------------------------------------------*/

//Helper function to handle button clicks
function buttonListener(buttonId, callback) {
    const button = document.getElementById(buttonId);
    button.addEventListener("click", callback);
}

/*----------------------------------------------------------------*/

function renewGame(event) {
    gamebox.resetGrid();
    tetromino = restartGame(event.timeStamp);
    gameLoop(event.timeStamp);
}

/*----------------------------------------------------------------*/

function startGame() {
    document.getElementById("startButton").blur();
    document.getElementById("startBox").style.display = "none";
    document.getElementById("screenOverlay").style.display = "none";
    const now = performance.now()
    gameStatus.startInit(now);
    tetromino = new Tetromino(tetrominoesData[gameStatus.nextTetromino]);
    pickAndShowNextTetromino();
    gameLoop(now);
}

/*----------------------------------------------------------------*/

function pauseGame(event) {
    if (gameStatus.isOver === true) {
        return
    }
    pauseResumeToggle(event.timeStamp);
    if (gameStatus.pause.is === false) gameLoop(event.timeStamp);
}

/*----------------------------------------------------------------*/
class InputHandler {
    constructor() {
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
        };
        window.addEventListener('keydown', e => {
            switch (e.key) {
                case "ArrowLeft":
                case "ArrowRight":
                case "ArrowDown":
                case "ArrowUp":
                    this.keys[e.key] = true;
                    break;
                case " ":
                    if (!gameStatus.startScreen) pauseGame(e);
                    break;
                case "r":
                case "R":
                    if (!gameStatus.startScreen && !gameStatus.gameOverModal) renewGame(e);
                    break;
            }
        });

        window.addEventListener('keyup', e => {
            if (e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowUp"
            ) {
                this.keys[e.key] = false;
            }
        });
    }

    /*------------------*/

    handleRotate(tetromino) {
        if (this.keys.ArrowUp) {
            tetromino.rotate();
            this.keys.ArrowUp = false;
        }
    }

    /*--------------------*/

    handleSideMoving(tetromino) {

        if (this.keys.ArrowRight) {
            tetromino.moveRight();
            this.keys.ArrowRight = false;

        } else if (this.keys.ArrowLeft) {
            tetromino.moveLeft();
            this.keys.ArrowLeft = false;
        }
    }

    /*--------------------*/

    handleSpeedUp() {

        if (this.keys.ArrowDown) {
            return true;
        }

        return false;
    }

}

/*----------------------------------------------------------------*/

let tetromino;
const input = new InputHandler();

/*----------------------------------------------------------------*/

function gameLoop(time) {
    if (tetromino.isFinal()) {
        return
    }

    const frameDuration = time - gameStatus.prevAnimationTime;
    gameStatus.frame.count++;
    gameStatus.gameOneSecond += frameDuration;

    if (gameStatus.gameOneSecond >= 1000) {
        updateMainTimer(time);

        gameStatus.updateHearts(time);
        if (gameStatus.statistic.heartsLeft === 0) {
            gameOver();
            return;
        }

        calculateFPS();
    }

    const totalSpeed = gameStatus.currentTetromino.speed.current * frameDuration + gameStatus.currentTetromino.speed.fraction
    let speed = Math.trunc(totalSpeed);
    gameStatus.currentTetromino.speed.fraction = totalSpeed - speed;

    if (input.handleSpeedUp()) speed = 8;

    gameStatus.currentTetromino.isBeingMovedDown = tetromino.moveDown(speed);

    //If tetromino can't move down anymore, wait for 300ms, so player can still move it right/left
    if (!gameStatus.currentTetromino.isBeingMovedDown) {

        if (tetromino.isOnTop()) {
            gameOver();
            return;
        }
        gameStatus.currentTetromino.freezeDelayTime += frameDuration;

        //If waiting time for moving right/left is finished, save tetromino to game grid
        if (gameStatus.currentTetromino.freezeDelayTime > gameStatus.currentTetromino.delayBeforeFreeze) {

            gamebox.freezeTilesInBox(tetromino.getOccupiedCells());

            //Check if any row got finished and if yes, remove it/them and shift above rows
            const rowsToRemove = gamebox.checkForFinishedRows();
            if (rowsToRemove.length != 0) {
                gamebox.removeRows(rowsToRemove);
                gameStatus.updateAfterRowComplete(time, rowsToRemove.length)
            }

            //Create new tetromino
            tetromino = new Tetromino(tetrominoesData[gameStatus.nextTetromino]);
            //New tetromino fits fully to screen, but ends game
            if (tetromino.isFinal()) {
                gameOver();
                return;
            }

            pickAndShowNextTetromino();
        }
    }

    //Handle tetromino movement by player input
    input.handleRotate(tetromino);
    input.handleSideMoving(tetromino);

    gameStatus.prevAnimationTime = time;
    //Loop the animation if not paused
    gameStatus.frame.animationId = requestAnimationFrame(gameLoop);
}