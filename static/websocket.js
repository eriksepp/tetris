import { scoreboard, updatePageNumber, updateScoreboard } from "./scoreboardHandler.js";

export let socket;

export function startWebSocket() {
    socket = new WebSocket("ws://localhost:8080/socket");
    console.log("Attempting connection to server...");

    socket.onopen = () => {
        console.log("Successfully connected to server");
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        switch (message.type) {
            case 'scoreboard_start':
                scoreboard.allCurrentScores = message.payload;
                scoreboard.currentPage =1;
                updatePageNumber(true);
                updateScoreboard();
                break;
            case 'scoreboard_added':
                scoreboard.allCurrentScores = message.payload;
                updatePageNumber(true);
                updateScoreboard();
                break;
        };
    }
}