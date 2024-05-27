'use strict'

import { selectPieceFunctions, selectingData, turnExecution } from "./gameLogic/pieceMove";
import { coreData } from "./gameStatus";

export const aiTurn = {
    playerColor: 'Black',
    aiAvailableMoves: {
        pawn01: [['pawn01Black'], []],
        pawn02: [['pawn02Black'], []],
        pawn03: [['pawn03Black'], []],
        pawn04: [['pawn04Black'], []],
        pawn05: [['pawn05Black'], []],
        pawn06: [['pawn06Black'], []],
        pawn07: [['pawn07Black'], []],
        pawn08: [['pawn08Black'], []],
        tower01: [['tower01Black'], []],
        tower02: [['tower02Black'], []],
        knight01: [['knight01Black'], []],
        knight02: [['knight02Black'], []],
        bishop01: [['bishop01Black'], []],
        bishop02: [['bishop02Black'], []],
        queen01: [['queen01Black'], []],
        queen02: [['queen02Black'], []],
        king01: [['king01Black'], []],
    },
    executeAiTurn() {

        this.resetAiAvailableMoves();
        
        this.checkValidMoves();

        let [ choosenPiece, choosenMove ] = this.evaluateMoves();

        console.log(choosenPiece, choosenMove);

        this.placeTurn(choosenPiece, choosenMove);
    },
    checkValidMoves() {
        // Detect all own pieces
        for (let i = 0; i < coreData.board.length; i++) {
            for (let j = 0; j < coreData.board[i].length; j++) {
                if (coreData.board[i][j].includes(this.playerColor)) {
                    console.log(coreData.board[i][j])
                    // Check if they have a available Move
                    selectingData.pieceId = coreData.board[i][j];
                    if(selectPieceFunctions.calculateValidMoves(selectingData.pieceName)) {
                        this.aiAvailableMoves[selectingData.pieceId.slice(0, -5)][1] = [...selectingData.availableMoves];
                    };
                };
            };
        };  
    },
    evaluateMoves() {
        let bestMove = null;
        let bestScore = 0;

        for (const piece in this.aiAvailableMoves) {
            const pieceData = this.aiAvailableMoves[piece];
            const pieceName = pieceData[0][0];
            const moves = pieceData[1];

            for (const move of moves) {
                // Evaluate the Move
                if(move.length === 0) continue;
                const score = this.evaluateMove(move);
    
                // Save the best Move
                if (score > bestScore) {
                    bestScore = score;
                    console.log(bestScore, 'Piece:', pieceName);
                    bestMove = [ pieceName, move ];
                };
            };
        };

        return bestMove;
    },
    evaluateMove(move) {
        const [ row, col ] = move;

        const enemyPiece = coreData.board[row][col];

        if(enemyPiece === '') return this.getFieldValue(row, col);

        let value = this.getPieceValue(enemyPiece) + this.getFieldValue(row, col);

        return value;
    },
    getPieceValue(enemyPiece) {
        if(enemyPiece === 'king01Black') return 20;

        enemyPiece = enemyPiece.slice(0, -7);
        const value = {
            pawn: 10,
            knight: 30,
            bishop: 30,
            tower: 50,
            queen: 100,
            king: 1000,
        };

        return value[enemyPiece];
    },
    getFieldValue(row, col) {
        const boardValue = [
            [1, 2, 2, 2, 2, 2, 2, 1],
            [2, 3, 4, 4, 4, 3, 3, 2],
            [2, 4, 6, 7, 7, 6, 4, 2],
            [2, 4, 7, 8, 8, 7, 4, 2],
            [2, 4, 7, 8, 8, 7, 4, 2],
            [2, 4, 6, 7, 7, 6, 4, 2],
            [2, 3, 4, 4, 4, 4, 3, 2],
            [1, 2, 2, 2, 2, 2, 2, 1]
        ];

        return boardValue[row][col];
    },
    placeTurn(piece, move) {
        selectingData.pieceId = piece;

        const fieldId = this.getFieldId(move)

        turnExecution.executeTurn('ai', fieldId)
    },
    getFieldId(move) {
        const [row, col] = move;
        let fieldNumber = row * 8 + col + 1;
        if (fieldNumber < 10) fieldNumber = `0` + fieldNumber;
        return `field${fieldNumber}`;
    },
    resetAiAvailableMoves() {
        this.aiAvailableMoves = {
            pawn01: [['pawn01Black'], []],
            pawn02: [['pawn02Black'], []],
            pawn03: [['pawn03Black'], []],
            pawn04: [['pawn04Black'], []],
            pawn05: [['pawn05Black'], []],
            pawn06: [['pawn06Black'], []],
            pawn07: [['pawn07Black'], []],
            pawn08: [['pawn08Black'], []],
            tower01: [['tower01Black'], []],
            tower02: [['tower02Black'], []],
            knight01: [['knight01Black'], []],
            knight02: [['knight02Black'], []],
            bishop01: [['bishop01Black'], []],
            bishop02: [['bishop02Black'], []],
            queen01: [['queen01Black'], []],
            queen02: [['queen02Black'], []],
            king01: [['king01Black'], []],
        };
    },
};