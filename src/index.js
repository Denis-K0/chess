"use strict";
import "./style/style.css";
import { coreData, gameStatus } from "./js/gameStatus";

function startGame() {
    coreData.getPlayerName();
    gameStatus.resetGame();
};

// UI
function changePlayer() {
    document.getElementById('changePlayerBtn').addEventListener('click', startGame)
};

changePlayer();
startGame();