import { tetrominoesData, HEART_TIME, START_SPEED, RISE_SPEED_COEFF, responseTexts, gameOverTextTemp } from "./initData.js";
import { Tetromino } from "./tetrominoClass.js";
import { socket } from "./websocket.js"
import { scoreboard } from "./scoreboardHandler.js";

/*-----------------------------------------------*/

const constantElements = {
    fpsDisplay: document.getElementById("fpsDisplay"),
    mainTimer: document.getElementById("mainTimer"),
    scoreSpan: document.getElementById("score"),
    linesSpan: document.getElementById("lines"),
    levelSpan: document.getElementById("level"),
    nameInput: document.getElementById("nameInput"),
}

/*-----------------------------------------------*/

export let gameStatus = {
    startScreen: true,
    gameOverModal: false,
    isOver: false,
    startTime: undefined,
    prevAnimationTime: undefined,
    gameOneSecond: 0,
    nextTetromino: chooseTetrominoNumber(),

    /*----------------*/

    pause: {
        startTime: undefined,
        duration: 0,
        is: false,
    },

    /*----------------*/

    activeHeart: {
        startTime: undefined,
        pauseDuration: 0,
        activeWrapperEl: document.getElementsByClassName("heartWrapper")[2],
        activeSymbolEl: document.getElementsByClassName("heart")[2],
        activeStopperEl: document.getElementsByClassName("heartStopper")[2],


        refill(fireTime) {
            this.activeStopperEl.textContent = HEART_TIME;
            this.activeSymbolEl.classList.remove("heartBlinkLastSecs");
            this.activeWrapperEl.classList.add("refillHeart");
            setTimeout(()=>this.activeWrapperEl.classList.remove("refillHeart"),620)
            this.startTime = fireTime + 1000;
            this.pauseDuration = 0;
        }
    },

    /*----------------*/

    currentTetromino: {
        isBeingMovedDown: true,
        freezeDelayTime: 0,
        delayBeforeFreeze: 300,
        speed: {
            current: START_SPEED,
            fraction: 0,
        },
    },

    /*----------------*/

    frame: {
        count: 0,
        last: undefined,
        animationId: 0,
    },

    /*----------------*/

    statistic: {
        heartsLeft: 3,
        score: 0,
        completedLines: 0,
        level: 1,

        displayScore() {
            constantElements.scoreSpan.textContent = String(this.score).padStart(4, '0');
        },

        displayLines() {
            constantElements.linesSpan.textContent = this.completedLines;
        },

        displayLevel() {
            constantElements.levelSpan.textContent = this.level;
        },

    },

    /*----------------*/

    //Updated score by how many rows were completed at once
    updateScore(rowsCompleted) {
        const pointsPerRows = {
            1: (100 * this.statistic.level),
            2: (300 * this.statistic.level),
            3: (500 * this.statistic.level),
            4: (800 * this.statistic.level),
        }
        this.statistic.score += pointsPerRows[rowsCompleted];
        this.statistic.displayScore();
    },

    /*----------------*/

    updateLines(number) {
        this.statistic.completedLines += number;
        this.statistic.displayLines();
    },

    /*----------------*/

    levelUp() {
        if ( this.statistic.completedLines / 10 >= this.statistic.level) {
            this.statistic.level++;
            this.currentTetromino.speed.current += RISE_SPEED_COEFF * START_SPEED;
            this.currentTetromino.delayBeforeFreeze -= 50;
            this.statistic.displayLevel();
        }
    },

    /*----------------*/

    updateAfterRowComplete(fireTime, removedRows) {
        this.activeHeart.refill(fireTime);
        this.updateScore(removedRows);
        this.updateLines(removedRows);
        this.levelUp();
    },

    /*--------------------*/

    updateHearts(time) {
        let heartTime = HEART_TIME - ((time - this.activeHeart.startTime - this.activeHeart.pauseDuration) / 1000);
        if (heartTime > HEART_TIME) heartTime = HEART_TIME;

        if (heartTime < 0.5) {
            this.removeHeart(time);
        } else {
            this.activeHeart.activeStopperEl.textContent = heartTime.toFixed();
            if (heartTime <= 3 && heartTime >= 2) {
                this.activeHeart.activeSymbolEl.classList.add("heartBlinkLastSecs");
            }
        }
    },

    /*--------------------*/

    //Remove heart if time has ran out
    removeHeart(time) {
        this.statistic.heartsLeft -= 1;
        this.activeHeart.activeStopperEl.textContent = "";
        this.activeHeart.activeSymbolEl.classList.remove("heartBlinkLastSecs");
        this.activeHeart.activeSymbolEl.classList.add("removedHeart");

        if (this.statistic.heartsLeft !== 0) {
            this.activeHeart.startTime = time;
            this.activeHeart.pauseDuration = 0;

            //Update DOM element variables with new active heart elements
            this.activeHeart.activeWrapperEl = document.getElementsByClassName("heartWrapper")[this.statistic.heartsLeft - 1];
            this.activeHeart.activeSymbolEl = document.getElementsByClassName("heart")[this.statistic.heartsLeft - 1];
            this.activeHeart.activeStopperEl = document.getElementsByClassName("heartStopper")[this.statistic.heartsLeft - 1];

            //Wait for previous hearts dissapearing animation to finish, then show seconds on next active heart
            setTimeout( () => {
                this.activeHeart.activeStopperEl.textContent = HEART_TIME;
            }, 500)
        }
    },

    /*--------------------*/

    startInit(now) {
        this.startScreen = false;
        this.startTime = now;
        this.activeHeart.startTime = now;
        this.frame.last = now;
        this.prevAnimationTime = now;
    },

    /*--------------------*/

    reset(now) {
        this.startTime = now;
        this.isOver = false;
        this.prevAnimationTime = now;
        this.gameOneSecond = 0;
        this.pause.duration = 0;
        this.pause.is = false;
        this.activeHeart.startTime = now;
        this.activeHeart.pauseDuration = 0;
        this.activeHeart.activeWrapperEl = document.getElementsByClassName("heartWrapper")[2];
        this.activeHeart.activeSymbolEl = document.getElementsByClassName("heart")[2];
        this.activeHeart.activeStopperEl = document.getElementsByClassName("heartStopper")[2];
        this.currentTetromino.isBeingMovedDown = true;
        this.currentTetromino.freezeDelayTime = 0;
        this.currentTetromino.delayBeforeFreeze = 300;
        this.currentTetromino.speed.current = START_SPEED;
        this.currentTetromino.speed.fraction = 0;
        this.frame.count = 0;
        this.frame.last = now;
        this.statistic.heartsLeft = 3;
        this.statistic.score = 0;
        this.statistic.completedLines = 0;
        this.statistic.level = 1;
    }
}

/*-----------------------------------------------*/

function chooseTetrominoNumber() {
    return Math.floor(Math.random() * 7)
}

/*-----------------------------------------------*/

export function pauseResumeToggle(timeStamp) {
    const pauseBtn = document.getElementById("pauseButton");
    const pauseBtnText = document.getElementById("pauseButtonText");
    if (gameStatus.pause.is === true) {
        const newPauseDuration =timeStamp - gameStatus.pause.startTime;
        gameStatus.pause.duration += newPauseDuration;
        gameStatus.activeHeart.pauseDuration += newPauseDuration;
        togglePauseButton(pauseBtn, pauseBtnText, "PAUSE", "pauseButtonGreen", "pauseButtonBlue")
        toggleMessageBox();
        gameStatus.activeHeart.activeSymbolEl.style.animationPlayState = "running";
        gameStatus.prevAnimationTime = timeStamp;
        gameStatus.pause.is = false;
    } else {
        gameStatus.pause.startTime = timeStamp;
        window.cancelAnimationFrame(gameStatus.frame.animationId);
        togglePauseButton(pauseBtn, pauseBtnText, "RESUME", "pauseButtonBlue", "pauseButtonGreen")
        toggleMessageBox("PAUSED");
        gameStatus.activeHeart.activeSymbolEl.style.animationPlayState = "paused";
        gameStatus.pause.is = true;
    }
}

/*-----------------------------------------------*/

function togglePauseButton(pauseBtn, pauseBtnText, text, classToRemove, classToAdd) {
    pauseBtnText.textContent = text;
    pauseBtn.classList.remove(classToRemove);
    pauseBtn.classList.add(classToAdd);
}

/*-----------------------------------------------*/

export function restartGame(now) {
    window.cancelAnimationFrame(gameStatus.frame.animationId);
    constantElements.mainTimer.textContent = "00:00";

    const gameboxElement = document.getElementById("gamebox");
    const tetrominoes = gameboxElement.querySelectorAll('.tetromino');
    tetrominoes.forEach(tetromino => {
        tetromino.remove();
    });


    if (gameStatus.pause.is === true) {
        togglePauseButton(document.getElementById("pauseButton"), document.getElementById("pauseButtonText"), "PAUSE", "pauseButtonGreen", "pauseButtonBlue")
    }

    const messageBox = document.getElementById("gameMessageBox");
    messageBox.style.display = "none";

    gameStatus.reset(now);
    resetHearts();

    gameStatus.statistic.displayScore();
    gameStatus.statistic.displayLines();
    gameStatus.statistic.displayLevel();

    pickAndShowNextTetromino();
    return new Tetromino(tetrominoesData[chooseTetrominoNumber()]);
}

/*-----------------------------------------------*/

function resetHearts() {
    const hearts = document.getElementsByClassName("heart");
    [...hearts].forEach(heart => {
        heart.classList.remove("removedHeart");
        heart.classList.remove("heartBlinkLastSecs");
        heart.style.animationPlayState = "running";
        heart.style.opacity = "1";
    });

    const heartStopper = document.getElementsByClassName("heartStopper");
    heartStopper[0].textContent = "";
    heartStopper[1].textContent = "";
    heartStopper[2].textContent = HEART_TIME;
}

/*-----------------------------------------------*/

function toggleMessageBox(message) {
    const messageBox = document.getElementById("gameMessageBox");
    const messageSpan = document.getElementById("gameMessage");
    if (messageBox.style.display !== "flex") {
        messageSpan.textContent = message;
        messageBox.style.display = "flex";
    } else {
        messageBox.style.display = "none";
    }
}

/*-----------------------------------------------*/

export function pickAndShowNextTetromino() {
    const tetrominoPreviews = document.getElementsByClassName("nextTetromino");
    tetrominoPreviews[gameStatus.nextTetromino].style.opacity = "0";
    gameStatus.nextTetromino = chooseTetrominoNumber();
    tetrominoPreviews[gameStatus.nextTetromino].style.opacity = "1";
}

/*-----------------------------------------------*/

export function gameOver() {
    sendScoreForRanking();
    gameStatus.isOver = true;
}

/*-----------------------------------------------*/

export function calculateFPS() {
    let averageFPS = (gameStatus.frame.count) / (gameStatus.gameOneSecond / 1000);

    constantElements.fpsDisplay.textContent = averageFPS.toFixed(2);

    gameStatus.frame.count = 0;
    gameStatus.gameOneSecond = 0;
}

/*-----------------------------------------------*/

export function updateMainTimer(time) {
    let playingTime = time - gameStatus.startTime - gameStatus.pause.duration;
    constantElements.mainTimer.textContent = msToMinutesSecondsString(playingTime);
}

/*-----------------------------------------------*/

function msToMinutesSecondsString(ms) {
    var minutes = String(Math.floor(ms / 60000));
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes.padStart(2,'0') + ":" + seconds.padStart(2,'0');
}

/*--------------------- GAME OVER WINDOW ---------------------*/

//Before showing game over window, send current score to server to receive rank and percentile
function sendScoreForRanking() {
    const message = { 
        type: "getRanking",
        payload: gameStatus.statistic.score
    }

    socket.send(JSON.stringify(message));

    socket.addEventListener("message", receiveRanking);
}

/*-----------------------------------------------*/

//If rank and percentile are received, show game over window and update current scoreboard page
function receiveRanking(event) {
    const message = JSON.parse(event.data);
    if (message.type === "ranking") {
        showGameOverModal(message.payload);
        scoreboard.currentPage = Math.ceil(message.payload.Position / 5);
        socket.removeEventListener("message", receiveRanking);
    }
}

/*-----------------------------------------------*/

//Fill game over modal with relevant response text, score, rank and percentile and show it
function showGameOverModal(rankingData) {
    gameStatus.gameOverModal = true;

    const responseText = pickResponseText(gameStatus.statistic.score);

    let gameOverText = gameOverTextTemp.replace('{responseText}', responseText)
        .replace('{score}', gameStatus.statistic.score)
        .replace('{rank}', rankingData["Rank"])
        .replace('{percentile}', rankingData["Percentile"]);

    document.getElementById("gameOverText").textContent = gameOverText;
    document.getElementById("gameOverBox").style.display = "flex";
    document.getElementById("screenOverlay").style.display = "block";
    constantElements.nameInput.focus();
}

/*-----------------------------------------------*/

//Pick game over response text according to player's score
function pickResponseText(score) {
    let response;
    if (score === 0) {
        response = responseTexts["zero"];
    } else if (score < 3000) {
        response = responseTexts["low"];
    } else if (score < 15000) {
        response = responseTexts["medium"];
    } else {
        response = responseTexts["high"];
    }
    let randomIndex = Math.floor(Math.random() * response.length);
    return response[randomIndex];
}

/*-----------------------------------------------*/

//If player inputs valid name (not empty spaces) make score input button active and listen for Enter press
export function nameInputEventListener() {
    const submitButton = document.getElementById("submitScoreButton");
    constantElements.nameInput.addEventListener("input", function () {
        if (this.value.trim() !== "") {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
        
    })
    constantElements.nameInput.addEventListener("keydown", function (event) {
        if (event.key ==='Enter'&& this.value.trim() !== "") submitScore()
    })
}

/*-----------------------------------------------*/

//Send last game's data to server and close game over modal
export function submitScore() {
    const lastGameData = {
        name: constantElements.nameInput.value,
        score: gameStatus.statistic.score,
        time: document.getElementById("mainTimer").textContent,
    }

    const message = {
        type: "addEntry",
        payload: lastGameData
    }

    socket.send(JSON.stringify(message));

    //Close and reset game over elements
    constantElements.nameInput.value = "";
    constantElements.nameInput.blur();
    document.getElementById("submitScoreButton").disabled = true;
    document.getElementById("gameOverBox").style.display = "none";
    document.getElementById("screenOverlay").style.display = "none";
    gameStatus.gameOverModal = false;
}