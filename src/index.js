"use strict";
import "./style/style.css";
import { coreData } from "./js/data";

function startGame() {
    // resetGame();
    coreData.getPlayerName();
    coreData.updateBoard();
}

// UI
function changePlayer() {
    document.getElementById('changePlayerBtn').addEventListener('click', startGame)
};

changePlayer();
startGame();