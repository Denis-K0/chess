import "./style/style.css";

import { coreData } from "./js/data";
import { selectors } from "./js/gameLogic/pieceMove";

"use strict";

function startGame() {
    // resetGame();
    coreData.getPlayerName();
    coreData.updateBoard();
    selectors.addEventsToBoard();
}

// UI
function changePlayer() {
    document.getElementById('changePlayerBtn').addEventListener('click', startGame)
};

changePlayer();
startGame();