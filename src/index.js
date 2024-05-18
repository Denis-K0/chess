import "./style/style.css";

import { updateBoard, getPlayerName } from "./js/data";

"use strict";

function startGame() {
    // resetGame();
    getPlayerName();
    updateBoard();
    // addEventsToBoard();
}

function changePlayer() {
    document.getElementById('changePlayerBtn').addEventListener('click', startGame)
};

changePlayer();
startGame();