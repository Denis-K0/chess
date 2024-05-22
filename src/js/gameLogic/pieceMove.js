import { coreData } from "../data";
import { showPieceMovements } from "./pieces";
"use strict";

// Add Events to the board for the selecting of the pieces.
export const selectors = {
    htmlBoard: document.querySelectorAll('.fieldCluster'),
    addEventsToBoard: function() {
        selectors.htmlBoard.forEach((cluster) => {
            cluster.addEventListener('click', selectPieceFunctions.selectPiece);
        })
    },
    removeEventsFromBoard: function() {
        selectors.htmlBoard.forEach((cluster) => {
            cluster.removeEventListener('click', selectPieceFunctions.selectPiece);
        })
    },
};

export const selectingData = {
    pieceId: '',
    availableMoves: [],
    get pieceName() {
        return this.getPieceName(this.pieceId);
    },

    get piecePosition() {
        return this.getPiecePosition(this.pieceId);
    },

    get pieceColor() {
        return this.pieceId.includes('White') ? 'White' : 'Black';
    },

    get enemyColor() {
        return this.pieceColor === 'White' ? 'Black' : 'White';
    },
    getPieceName(pieceId) {
        const zeroIndex = pieceId.indexOf('0');
        return pieceId.slice(0, zeroIndex);
    },
    getPiecePosition(pieceId) {
        for (let i = 0; i < coreData.board.length; i++) {
            for (let j = 0; j < coreData.board[i].length; j++) {
                if (coreData.board[i][j] === pieceId) {
                    return [i, j];
                }
            }
        };

        throw new Error("Piece not found on the board! - F:getPiecePosition")
    },
};

const selectPieceFunctions = {
    selectPiece(event) {
        const cluster = event.currentTarget;
        selectingData.pieceId = cluster.children[0]?.id ?? 'No Piece in Cluster';
        console.log(selectingData.pieceId);
    
        // First: Check if the Field is valid to be selected from the Player
        if(!selectPieceFunctions.checkValidTurn(selectingData.pieceId)) return; 
        console.log('Valid Turn Success');
        // Second: Calculate the possible moves & store them
        selectPieceFunctions.calculateValidMoves(selectingData.pieceName);
    },
    checkValidTurn(pieceId) {
        if(coreData.round % 2 !== 0) {
            if(pieceId.includes('White')) return true;
        };
    
        if(coreData.round % 2 === 0) {
            if(pieceId.includes('Black')) return true;
        };
    
        return false;
    },
    calculateValidMoves(pieceName) {
        const possibleMoves = showPieceMovements[pieceName](selectingData.enemyColor, selectingData.piecePosition, 
            coreData.board, selectingData.pieceColor, selectingData.pieceId, coreData.check);
        
        selectingData.availableMoves = selectPieceFunctions.filterInvalidMoves(possibleMoves);
        if(selectingData.availableMoves.toString() === '') return console.log('No Available Turns');
        console.log('Avaiable Moves', ...selectingData.availableMoves);

        selectPieceFunctions.displayValidMoves();
    },
    filterInvalidMoves(possibleMoves) {
        const filteredMoves = [];
        // Control by each possible move, if a Check is given 
        for(const move of possibleMoves) {
            let newBoard = selectPieceFunctions.simulateMove(move, selectingData.pieceId, selectingData.piecePosition);
            if(!coreData.isKingInCheck(`king01${selectingData.pieceColor}`, newBoard)) {
            filteredMoves.push(move);
            };
        };
        return filteredMoves;
    },
    // Simulated a board with the executed Move
    simulateMove(move, pieceId, piecePosition) {
        const [targedRow, targedCol] = move;
        const [currentRow, currentCol] = piecePosition;
        let createdBoard = JSON.parse(JSON.stringify(coreData.board));
        createdBoard[targedRow][targedCol] = pieceId;
        createdBoard[currentRow][currentCol] = '';
        return createdBoard;
    },
};