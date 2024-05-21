import { coreData } from "../data";
import { showPiecesMovements } from "./pieces";
"use strict";

// Add Events to the board for the selecting of the pieces.
const selectors = {
    htmlBoard: document.querySelectorAll('.fieldCluster'),
    addEventsToBoard: function() {
        selectors.htmlBoard.forEach((cluster) => {
            cluster.addEventListener('click', selectPiece);
        })
    },
    removeEventsFromBoard: function() {
        selectors.htmlBoard.forEach((cluster) => {
            cluster.removeEventListener('click', selectPiece);
        })
    },
};

function selectPiece(event) {

    const data = {
        cluster: event.currentTarget,
        pieceName: getPieceName(cluster.children[0].id),
        pieceId: cluster.children[0].id,
        piecePosition: storedFunctions.getPiecePosition(data.pieceId),
        pieceColor: pieceId.includes('White') ? 'White' : 'Black',
        enemyColor: (pieceColor === 'White') ? 'White' : 'Black'
    };

    const storedFunctions = {
        checkValidTurn: function(cluster) {
            let pass = 0
        
            if(coreData.round % 2 !== 0) {
                if(cluster.children[0]?.id.slice(-5) === 'White' ) return pass = 1
            };
        
            if(coreData.round % 2 === 0) {
                if(cluster.children[0]?.id.slice(-5) === 'Black' ) return pass = 1
            };
        
            return pass;
        },
        getPieceName: function(piece) {
            const zeroIndex = piece.indexOf('0');
            return piece.slice(0, zeroIndex);
        },
        calculateValidMoves: function(pieceName) {
            possibleMoves = showPiecesMovements[pieceName](data.enemyColor, data.piecePosition, 
                coreData.board, data.pieceColor, data.pieceId, coreData.check);
        },
        getPiecePosition: function() {
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === pieceId) {
                        return [i, j];
                    }
                }
            };

            throw new Error("Piece not found on the board! - F:getPiecePosition")
        },
    };

    // First: Check if the Field is valid to be selected from the Player
    if(storedFunctions.checkValidTurn(data.cluster) === 0) return; 
    // Second: Calculate the possible moves & store them
    storedFunctions.calculateValidMoves(data.pieceName);
    // Third: Filter these moves on additional criteria
    // filterInvalidMoves()

};


// Check if the Field is valid to be selected from the Player







