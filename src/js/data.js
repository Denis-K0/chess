"use strict";

import { selectingData, selectors } from "./gameLogic/pieceMove";
import { showPieceMovements } from "./gameLogic/pieces";

export const coreData = {
    round: 0,
    check: false,
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
        // checkAiTurn(); if no addEventsToBoard
        selectors.addEventsToBoard();
    },
    countRounds: function() {
        coreData.round += 1;
    },
    // Parameter 'king' & 'board' are needed if called by filterInvalidMoves()
    isKingInCheck(king = `king01${selectingData.enemyColor}`, board = coreData.board) {
        const dangerColor = king.includes('Black') ? 'White' : 'Black';   // Enemy Color
        const pieceColor = (dangerColor === 'Black') ? 'White' : 'Black'; // Own Color
        
        // Detect all Enemies in the Board.
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].includes(dangerColor)) {
                    // Collect all possible Moves of the Enemy
                    let dangerId = board[i][j];
                    let dangerName =  selectingData.getPieceName(dangerId);
                    let dangerPosition = [i, j];
                    let kingPosition = selectingData.getPiecePosition(king, board);

                    const { possibleMoves, rochade } = showPieceMovements[dangerName](pieceColor, dangerPosition, 
                        board, dangerColor, dangerId, coreData.check);

                    // Control if one Move match to the Position of the King
                    for (const move of possibleMoves) {
                        if (move[0] === kingPosition[0] && move[1] === kingPosition[1]) {
                            console.log("Zug entfernt");
                            return true;
                        };
                    };
                };
            };
        };
        return false;
    },
};