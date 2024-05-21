import "./style/style.css";

import { coreData } from "./js/data";

"use strict";

function startGame() {
    // resetGame();
    coreData.getPlayerName();
    coreData.updateBoard();
    // addEventsToBoard();
}

// UI
function changePlayer() {
    document.getElementById('changePlayerBtn').addEventListener('click', startGame)
};

changePlayer();
startGame();