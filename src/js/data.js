"use strict";

export const coreData = {
    round: 0,
    check: 0,
    player01: 'Player01',
    player02: 'AI',
    board: [],
    getPlayerName: function() {
        coreData.player01 = document.getElementById('player01').value || 'Player01';
        coreData.player02 = document.getElementById('player02').value || 'AI';
    },
    // Update the Board Array depending on the board in the DOM
    updateBoard: function() {
        const htmlBoard = document.querySelectorAll('.fieldCluster');
        coreData.board = [[], [], [], [], [], [], [], []];
        let i = 0;
    
        htmlBoard.forEach((boardCluster) => {
    
            // When a row is full, jump to the next
            if (coreData.board[0 + i].length === 8) {
                i++;
            };
    
            coreData.board[0 + i].push(boardCluster.children[0]?.id ?? "");
        });

        coreData.countRounds();

        console.log(coreData);

        // checkGameStatus():
        // checkAiTurn();
    },
    countRounds: function() {
        coreData.round += 1;
    },
};