"use strict"

import { coreData } from "../data";


// Obj. that serve as a Output for each Piece
export const showPieceMovements =  {
    pawn(enemyColor, piecePosition, board, pieceColor) {
        let possibleMoves = [];
        possibleMoves.push(...moves.getPawnMoves(enemyColor, piecePosition, board, pieceColor));
        return { possibleMoves };
    },
    tower(enemyColor, piecePosition, board, pieceColor, pieceId, check) {
        let possibleMoves = [];
        possibleMoves.push(...moves.getTowerMoves(enemyColor, piecePosition, board, pieceColor));
        let rochade = moves.getRochadMoves(enemyColor, piecePosition, board, pieceColor, pieceId, check);
        return { possibleMoves, rochade };
    },
    knight(enemyColor, piecePosition, board, pieceColor) {
        let possibleMoves = [];
        possibleMoves.push(...moves.getKnightMoves(enemyColor, piecePosition, board, pieceColor));
        return { possibleMoves };
    },
    bishop(enemyColor, piecePosition, board, pieceColor) {
        let possibleMoves = [];
        possibleMoves.push(...moves.getBishopMoves(enemyColor, piecePosition, board, pieceColor));
        return { possibleMoves };
    },
    queen(enemyColor, piecePosition, board, pieceColor) {
        let possibleMoves = [];
        possibleMoves.push(...moves.getTowerMoves(enemyColor, piecePosition, board, pieceColor));
        possibleMoves.push(...moves.getBishopMoves(enemyColor, piecePosition, board, pieceColor));
        return { possibleMoves };
    },
    king(enemyColor, piecePosition, board, pieceColor) {
        let possibleMoves = [];
        possibleMoves.push(...moves.getKingMoves(enemyColor, piecePosition, board, pieceColor));
        return { possibleMoves };
    },
};

const moves = {
    getPawnMoves(enemyColor, piecePosition, board, pieceColor) {
        const direction = (pieceColor === 'White') ? -1 : 1;
        const [row, col] = piecePosition;
        let movePoints = [];
    
        function getMoves() {
            // Single-Step
            if (row + direction < 0 || row + direction > 7 || col < 0 || col > 7) return; // Control first the board border
            if(board[row + direction][col] === '') {
                movePoints.push([row + direction, col]);
            } else return;
    
            // Double-Step
            if (row + (direction * 2) < 0 || row + (direction * 2) > 7 || col < 0 || col > 7) return;
            if(board[row + (direction * 2)][ col] !== '') return;
            if ((pieceColor === 'White' && row === 6) || (pieceColor === 'Black' && row === 1)) {
                    movePoints.push([row + (direction * 2), col]);
                };
        };
    
        function getAttacks() {
            // Left-Attack
            if (row + direction >= 0 && row + direction <= 7 && col - 1 >= 0 && (col - 1) <= 7) {
                if(board[row + direction][col - 1] !== '') {
                    if(board[row + direction][col - 1].includes(enemyColor)) {
                        movePoints.push([row + direction, col - 1]);
                    };
                };
            };
    
            // Right-Attack
            if (row + direction >= 0 && row + direction <= 7 && (col + 1) >= 0 && (col + 1) <= 7){
                if(board[row + direction][col + 1] !== '') {
                    if(board[row + direction][col + 1].includes(enemyColor)) {
                        movePoints.push([row + direction, col + 1]);
                    };
                };
            };
        };
    
        getMoves();
        getAttacks();
    
        return movePoints;
    },

    getTowerMoves(enemyColor, piecePosition, board, pieceColor) {
        const [row, col] = piecePosition;
        let movePoints = [];
    
        // Movement-Forward
        for(let i = row + 1; i < 8; i++) {
            if(board[i][col] !== '') {
                if(board[i][col].includes(enemyColor)) {
                    movePoints.push([i, col]);
                };
                break;
            };
            movePoints.push([i, col]);
        };
    
        // Movement-Backwards
        for(let i = row - 1; i >= 0; i--) {
            if(board[i][col] !== '') {
                if(board[i][col].includes(enemyColor)) {
                    movePoints.push([i, col]);
                };
                break;
            };
            movePoints.push([i, col]);
        };
    
        // Movement-Right
        for(let i = col + 1; i < 8; i++) {
            if(board[row][i] !== '') {
                if(board[row][i].includes(enemyColor)) {
                    movePoints.push([row, i]);
                };
                break;
            };
            movePoints.push([row, i]);
        };
    
        // Movement-Left
        for(let i = col - 1; i >= 0; i--) {
            if(board[row][i] !== '') {
                if(board[row][i].includes(enemyColor)) {
                    movePoints.push([row, i]);
                };
                break;
            };
            movePoints.push([row, i]);
        };
    
        return movePoints;
    },
    
    getRochadMoves(enemyColor, piecePosition, board, pieceColor, pieceId, check) {
        let [row, col] = piecePosition;
        let movePoints = [];
    
        function checkTowerConditions() {
            if(pieceId === 'tower01Black' && piecePosition.toString() === '0,0') return true;
            if(pieceId === 'tower02Black' && piecePosition.toString() === '0,7') return true;
            if(pieceId === 'tower01White' && piecePosition.toString() === '7,0') return true;
            if(pieceId === 'tower02White' && piecePosition.toString() === '7,7') return true;
            return false;
        };
    
        function checkKingConditions() {
            if(pieceColor === 'White' && board[7][4] === 'king01White') return true;
            if(pieceColor === 'Black' && board[0][4] === 'king01Black') return true;
            return false;
        };
    
        if (!checkTowerConditions() || !checkKingConditions() || coreData.check) return movePoints;
    
        row = (pieceColor === 'White') ? 7 : 0;

        // Rochade to the Right
        if(pieceId.includes('01')) {
            for(let i = col + 1; i <= 4; i++) {
                if(board[row][i] !== '') {
                    if(board[row][i].includes('king') && board[row][i].includes(pieceColor)) {
                        console.log('Rochade accepted');
                        return pieceId;
                    } else break;
                };
            };
        };

        // Rochade to the Left
        if(pieceId.includes('02')) {
            for(let i = col - 1; i >= 4; i--) {
                if(board[row][i] !== '') {
                    if(board[row][i].includes('king') && board[row][i].includes(pieceColor)) {
                        console.log('Rochade accepted');
                        return pieceId;
                    } else break;
                };
            };
        };

        return;
    },
    
    getKnightMoves(enemyColor, piecePosition, board, pieceColor) {
        const [row, col] = piecePosition;
        let movePoints = [];
    
        const directions =  [[2, 1], [2, -1], [1, 2], [-1, 2],
                            [-2, 1], [-2, -1], [1, -2], [-1, -2],
        ];
    
        directions.forEach(([rowIncrement, colIncrement]) => {
            const newRow = rowIncrement + row;
            const newCol = colIncrement + col;
    
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) return;
    
            if(board[newRow][newCol] === '') 
                return movePoints.push([newRow, newCol]);
            if(board[newRow][newCol].includes(enemyColor)) 
                return movePoints.push([newRow, newCol]);
        });
    
        return movePoints;
    },
    
    getBishopMoves(enemyColor, piecePosition, board, pieceColor) {
        const [row, col] = piecePosition;
        let movePoints = [];
    
        // Movement-TopRight
        for(let i = row + 1, j = col + 1; i < 8 && j < 8; i++, j++) {
            if(board[i][j] !== '') {
                if(board[i][j].includes(enemyColor)) {
                    movePoints.push([i, j]);
                };
                break;
            };
            movePoints.push([i, j]);
        };
    
        // Movement-TopLeft
        for(let i = row + 1, j = col - 1; i < 8 && j >= 0; i++, j--) {
            if(board[i][j] !== '') {
                if(board[i][j].includes(enemyColor)) {
                    movePoints.push([i, j]);
                };
                break;
            };
            movePoints.push([i, j]);
        };
    
        // Movement-DownLeft
        for(let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if(board[i][j] !== '') {
                if(board[i][j].includes(enemyColor)) {
                    movePoints.push([i, j]);
                };
                break;
            };
            movePoints.push([i, j]);
        };
    
        // Movement-DownRight
        for(let i = row - 1, j = col + 1; i >= 0 && j < 8; i--, j++) {
            if(board[i][j] !== '') {
                if(board[i][j].includes(enemyColor)) {
                    movePoints.push([i, j]);
                };
                break;
            };
            movePoints.push([i, j]);
        };
    
        return movePoints;
    },
    
    getKingMoves(enemyColor, piecePosition, board, pieceColor) {
        const [row, col] = piecePosition;
        let movePoints = [];
        const directions = [[1, 0], [1, 1], [0, 1],
                            [-1, 1], /* King */ [-1, 0], 
                            [-1, -1], [0, -1], [1, -1],
        ];
    
        directions.forEach(([rowIncrement, colIncrement]) => {
            const newRow = rowIncrement + row;
            const newCol = colIncrement + col;
            
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) return;
    
            if(board[newRow][newCol] === '') 
                return movePoints.push([newRow, newCol]);
            if(board[newRow][newCol].includes(enemyColor)) 
                return movePoints.push([newRow, newCol]);
        });
    
        return movePoints;
    },
};