"use strict";

import { selectingData, selectors } from "./gameLogic/pieceMove";
import { showPieceMovements } from "./gameLogic/pieces";

export const coreData = {
    round: 0,
    check: false,
    player01: 'Player01',
    player02: 'AI',
    board: [],
    getPlayerName() {
        coreData.player01 = document.getElementById('player01').value || 'Player01';
        coreData.player02 = document.getElementById('player02').value || 'AI';
    },
    // Update the Board Array depending on the board in the DOM
    updateBoard() {
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

        if(gameStatus.checkGameStatus()) return;
        // checkAiTurn(); if no addEventsToBoard
        selectors.addEventsToBoard();
    },
    countRounds() {
        coreData.round += 1;
    },

};

export const gameStatus = {
    checkGameStatus() {
        const playerKing = (coreData.round % 2 === 0) ? 'king01Black' : 'king01White'
        const player = (coreData.round % 2 === 0) ? coreData.player02 : coreData.player01;
        if(gameStatus.isKingInCheck(playerKing, coreData.board)) {
            // if(checkMate()) return true;
            alert(player + " is in Check!");
            return false;
        };
    },
    // Arguments 'king' & 'board' are always necessary
    isKingInCheck(king, board) {
        const dangerColor = king.includes('Black') ? 'White' : 'Black';   // Enemy Color
        const pieceColor = (dangerColor === 'Black') ? 'White' : 'Black'; // Own Color
        
        // If one Move of the Enemy get the own King in danger
        if(gameStatus.detectAllEnemies(king, board, dangerColor, pieceColor)) return true;

        return false;
    },
    // Detect all Enemies in the Board
    detectAllEnemies(king, board, dangerColor, pieceColor) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].includes(dangerColor)) {
                    if(gameStatus.collectAllMoves(king, board, dangerColor, pieceColor, i, j)) return true;
                };
            };
        };
        return false;
    },
    // Collect all possible Moves from the Enemy
    collectAllMoves(king, board, dangerColor, pieceColor, i, j) {
        let dangerId = board[i][j];
        let dangerName =  selectingData.getPieceName(dangerId);
        let dangerPosition = [i, j];
        let kingPosition = selectingData.getPiecePosition(king, board);

        const { possibleMoves, rochade } = showPieceMovements[dangerName]
        (pieceColor, dangerPosition, board, dangerColor, dangerId, coreData.check);
        
        if(gameStatus.controlMoveMatch(possibleMoves, kingPosition)) return true;
        return false;
    },
    // Control if one Move match to the Position of the King
    controlMoveMatch(possibleMoves, kingPosition) {
        for (const move of possibleMoves) {
            if (move[0] === kingPosition[0] && move[1] === kingPosition[1]) {
                console.log("Zug entfernt");
                return true;
            };
        };
        return false;
    },
    checkMate() {

    },
};