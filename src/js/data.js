"use strict";

import { selectingData } from "./gameLogic/pieceMove";
import { showPieceMovements } from "./gameLogic/pieces";

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
    // Parameter 'king' & 'board' are needed if called by filterInvalidMoves()
    isKingInCheck(king = `king01${selectingData.enemyColor}`, board = coreData.board) {
        const kingPosition = selectingData.getPiecePosition(king);
        const dangerColor = king.includes('Black') ? 'Black' : 'White';   // Enemy Color
        const pieceColor = (dangerColor === 'Black') ? 'White' : 'Black'; // Own Color
        
        // Detect all Enemies in the Board.
        for (let i = 0; i < coreData.board.length; i++) {
            for (let j = 0; j < coreData.board[i].length; j++) {
                if (coreData.board[i][j].includes(dangerColor)) {
                    // Collect all possible Moves of the Enemy
                    let dangerId = coreData.board[i][j];
                    let dangerName =  selectingData.getPieceName(dangerId);
                    let dangerPosition = [i, j];

                    const enemyMoves = showPieceMovements[dangerName](dangerColor, dangerPosition, 
                        board, pieceColor, dangerId, coreData.check);

                    // Control if one Move match to the Position of the King
                    for (const move of enemyMoves) {
                        if (move === kingPosition) {
                            return true;
                        };
                    };
                };
            };
        };
        return false;
    },
};