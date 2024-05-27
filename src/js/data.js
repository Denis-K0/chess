"use strict";

import { selectingData, selectors, selectPieceFunctions} from "./gameLogic/pieceMove";
import { showPieceMovements } from "./gameLogic/pieces";

export const coreData = {
    round: 0,
    White: {
        check: false,
        player01: 'Player01',
    },
    Black: {
        check: false,
        player02: 'AI',
    },
    board: [],
    getPlayerName() {
        this.White.player01 = document.getElementById('player01').value || 'Player01';
        this.Black.player02 = document.getElementById('player02').value || 'AI';
    },
    // Update the Board Array depending on the board in the DOM
    updateBoard() {
        const htmlBoard = document.querySelectorAll('.fieldCluster');
        this.board = [[], [], [], [], [], [], [], []];
        let i = 0;
    
        htmlBoard.forEach((boardCluster) => {
    
            // When a row is full, jump to the next
            if (this.board[0 + i].length === 8) {
                i++;
            };
    
            this.board[0 + i].push(boardCluster.children[0]?.id ?? "");
        });

        coreData.countRounds();

        console.log(coreData);

        gameStatus.checkGameStatus();
        // checkAiTurn(); if no addEventsToBoard
        selectors.addEventsToBoard();
    },
    countRounds() {
        this.round += 1;
    },
};

export const gameStatus = {
    originalHtmlBoard: document.getElementById('board').cloneNode(true),
    checkGameStatus() {
        const playerKing = (coreData.round % 2 === 0) ? 'king01Black' : 'king01White';
        const player = (coreData.round % 2 === 0) ? coreData.Black.player02 : coreData.White.player01;
        const playerColor = (coreData.round % 2 === 0) ? 'Black' : 'White';
        const enemyColor = (coreData.round % 2 === 0) ? 'White' : 'Black';
        if(this.isKingInCheck(playerKing, coreData.board)) {
            coreData[playerColor].check = true;

            if(this.checkMate(playerColor)) return this.runGameOver();

            alert(player + " is in Check!");
        } else {
            coreData[enemyColor].check = false;
            coreData[playerColor].check = false;
        }
    },
    // Arguments 'king' & 'board' are always necessary
    isKingInCheck(king, board) {
        const dangerColor = king.includes('Black') ? 'White' : 'Black';   // Enemy Color
        const pieceColor = (dangerColor === 'Black') ? 'White' : 'Black'; // Own Color
        
        // If one Move of the Enemy get the own King in danger
        if(this.detectAllEnemies(king, board, dangerColor, pieceColor)) return true;

        return false;
    },
    // Detect all Enemies in the Board
    detectAllEnemies(king, board, dangerColor, pieceColor) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].includes(dangerColor)) {
                    if(this.collectAllMoves(king, board, dangerColor, pieceColor, i, j)) return true;
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

        const { possibleMoves } = showPieceMovements[dangerName]
        (pieceColor, dangerPosition, board, dangerColor, dangerId);
        
        if(this.controlMoveMatch(possibleMoves, kingPosition)) return true;
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
    checkMate(playerColor) {
        // Detect all own pieces
        for (let i = 0; i < coreData.board.length; i++) {
            for (let j = 0; j < coreData.board[i].length; j++) {
                if (coreData.board[i][j].includes(playerColor)) {
                    // Check if they have a available Move
                    selectingData.pieceId = coreData.board[i][j];
                    if(selectPieceFunctions.calculateValidMoves(selectingData.pieceName)) {
                        return false;
                    };
                };
            };
        };  
        return true;
    },
    runGameOver() {
        const winner = (coreData.round % 2 === 0) ? 
        coreData.White.player01 : coreData.Black.player02;

        alert(winner + ' won the game!');

        this.resetGame();
    },
    resetGame() {
        coreData.round = 0;
        // Reset the Board
        document.getElementById('board').remove();

        const newBoard = gameStatus.originalHtmlBoard.cloneNode(true); 
        newBoard.id = 'board'; 
        document.getElementById('appContainer').appendChild(newBoard);

        coreData.updateBoard();
    },
};