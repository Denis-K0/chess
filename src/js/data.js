"use strict";

export const data = {
    round: 0,
    player01: 'Player01',
    player02: 'AI',
    board: [],
};

export function getPlayerName() {
    data.player01 = document.getElementById('player01').value || 'Player01';
    data.player02 = document.getElementById('player02').value || 'AI';
};

// Update the Board Array depending on the board in the DOM
export function updateBoard() {

    const htmlBoard = document.querySelectorAll('.fieldCluster');
    data.board = [[], [], [], [], [], [], [], []];
    let i = 0;

    htmlBoard.forEach((boardCluster) => {

        // When a row is full, jump to the next
        if (data.board[0 + i].length === 8) {
            i++;
        };

        data.board[0 + i].push(boardCluster.children[0]?.id ?? "");
    });
    
    console.log(data);

    countRounds();
    // checkGameStatus():
    // checkAiTurn();
};

function countRounds() {
    data.round += 1;
};



