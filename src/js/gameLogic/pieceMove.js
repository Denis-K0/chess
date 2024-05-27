import { coreData, gameStatus } from "../data";
import { showPieceMovements } from "./pieces";
"use strict";

// Handle the Events
export const selectors = {
    get htmlBoard() {
        return document.querySelectorAll('.fieldCluster');
    },
    addEventsToBoard() {
        selectors.htmlBoard.forEach((cluster) => {
            cluster.addEventListener('click', selectPieceFunctions.selectPiece);
        })
    },
    removeEventsFromBoard() {
        selectors.htmlBoard.forEach((cluster) => {
            cluster.removeEventListener('click', selectPieceFunctions.selectPiece);
            cluster.removeEventListener('click', turnExecution.executeTurn);
            cluster.removeEventListener('click', selectors.deselect);
            cluster.classList.remove('highlighted');
        })
    },
    addExecuteEventsToBoard() {
        selectors.htmlBoard.forEach((cluster) => {
            // Control first, if the Cluster match the possible Moves
            const clusterNumber = +cluster.id.slice(-2);
            if(selectors.checkCluster(clusterNumber)) {
                cluster.addEventListener('click', turnExecution.executeTurn);
                // Add a visual Mark to the Cluster
                cluster.classList.add('highlighted');
            } else {
                cluster.addEventListener('click', selectors.deselect);
            };
        });
    },
    checkCluster(clusterNumber) {
        for(const move of selectingData.availableMoves) {
            const [row, col] = move;
            const field = row * 8 + col + 1;
            if(field === clusterNumber) {
                return true;
            }
        };

        return false;
    },
    displayValidMoves() {
        selectors.removeEventsFromBoard();
        selectors.addExecuteEventsToBoard();
    },
    deselect() {
        selectors.removeEventsFromBoard();
        selectors.addEventsToBoard();
    },
};

export const selectingData = {
    pieceId: '',
    availableMoves: [],
    get pieceName() {
        return this.getPieceName(this.pieceId);
    },
    get piecePosition() {
        return this.getPiecePosition(this.pieceId, coreData.board);
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
    getPiecePosition(pieceId, board) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === pieceId) {
                    return [i, j];
                }
            }
        };
        throw new Error("Piece not found on the board! - F:getPiecePosition");
    },
};

export const selectPieceFunctions = {
    selectPiece(event) {
        const cluster = event.currentTarget;
        selectingData.pieceId = cluster.children[0]?.id ?? 'No Piece in Cluster';
        console.log(selectingData.pieceId);
        
        // First: Check if the Field is valid to be selected from the Player
        if(!selectPieceFunctions.checkValidTurn(selectingData.pieceId)) return console.log('Not your Turn'); 
        console.log('Valid Turn Success');

        // Second: Calculate the possible moves & store them
        if(!selectPieceFunctions.calculateValidMoves(selectingData.pieceName)) return console.log('No Available Turns');

        console.log('Avaiable Moves', ...selectingData.availableMoves);

        // Third: Show the User the available Moves
        selectors.displayValidMoves();
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
        const { possibleMoves } = showPieceMovements[pieceName](selectingData.enemyColor, selectingData.piecePosition, 
            coreData.board, selectingData.pieceColor, selectingData.pieceId);
        
        // Filter the possibleMoves, if they get in conflict with a danger for the own king
        selectingData.availableMoves = selectPieceFunctions.filterInvalidMoves(possibleMoves);

        if (selectingData.availableMoves.length === 0) {
            return false;
        }

        console.log('Possible Moves: ', selectingData.availableMoves);

        return true;
    },
    filterInvalidMoves(possibleMoves) {
        const filteredMoves = [];

        // Control by each possible move, if a Check is given 
        for(const move of possibleMoves) {
            let newBoard = selectPieceFunctions.simulateMove
            (move, selectingData.pieceId, selectingData.piecePosition, selectingData.pieceColor);

            if(!gameStatus.isKingInCheck(`king01${selectingData.pieceColor}`, newBoard)) {
                filteredMoves.push(move);
            } else console.log('Zug entfernt! ->' + move);
        };

        return filteredMoves;
    },
    // Simulate a board with the to executing Move
    simulateMove(move, pieceId, piecePosition, pieceColor) {
        const [targedRow, targedCol] = move;
        const [currentRow, currentCol] = piecePosition;
        let createdBoard = JSON.parse(JSON.stringify(coreData.board));

        // If Rochade ist true, then apply it correctly
        if(createdBoard[targedRow][targedCol].includes('king01' + pieceColor)) {
           createdBoard = selectPieceFunctions.correctBoardForRochade(createdBoard, pieceId);
           createdBoard[currentRow][currentCol] = '';
           console.log("SimulatedBoard->", createdBoard)
           return createdBoard;
        };

        createdBoard[targedRow][targedCol] = pieceId;
        createdBoard[currentRow][currentCol] = '';

        console.log("SimulatedBoard->", createdBoard)
        return createdBoard;
    },
    // Only necessary for the Board-Simulation
    correctBoardForRochade(createdBoard, towerId) {
        switch (towerId) {
            case "tower01Black":
                createdBoard[0][2] = 'king01Black';
                createdBoard[0][4] = '';
                createdBoard[0][3] = towerId;
                return createdBoard;
            case "tower02Black":
                createdBoard[0][6] = 'king01Black';
                createdBoard[0][4] = '';
                createdBoard[0][5] = towerId;
                return createdBoard;
            case "tower01White":
                createdBoard[7][2] = 'king01White';
                createdBoard[7][4] = '';
                createdBoard[7][3] = towerId;
                return createdBoard;
            case "tower02White":
                createdBoard[7][6] = 'king01White';
                createdBoard[7][4] = '';
                createdBoard[7][5] = towerId;
                return createdBoard;
            default:
                return console.log("Invalid towerId");
        };
    },
};
                    
export const turnExecution = {
    queenBlack: document.getElementById('queen01Black').cloneNode(true),
    queenWhite: document.getElementById('queen01White').cloneNode(true),
    executeTurn(event, target) {
        // Get the involved Elements
        let targetCluster = 0;
        if(event === 'ai') {
            targetCluster = document.getElementById(target)
        } else {
            targetCluster = event.currentTarget;
        };
        const pieceElement = document.getElementById(selectingData.pieceId);
        const sourceCluster = pieceElement.parentElement;

        // If the Turn contains not a rochade
        if(!turnExecution.executeRochadeTurn(targetCluster, pieceElement, sourceCluster)) {

            // Set the piece to the target position
            turnExecution.executeNormalTurn(targetCluster, pieceElement, sourceCluster);
        };

        // If the Turn contains a promotion
        turnExecution.executePromotion(targetCluster, pieceElement);

        // Set the board back & update it
        selectors.removeEventsFromBoard();
        coreData.updateBoard();
    },

    executeNormalTurn(targetCluster, pieceElement, sourceCluster) {
        sourceCluster.removeChild(pieceElement);
        targetCluster.children[0]?.remove();
        targetCluster.appendChild(pieceElement);
    },
    executeRochadeTurn(targetCluster, pieceElement, sourceCluster) {
        console.log(selectingData.pieceColor);
        console.log(targetCluster.children[0]?.id);
        if(!targetCluster.children[0]?.id.includes('king01' + selectingData.pieceColor)) return false;

        switch (pieceElement.id) {
            case "tower01Black":
                const kingElement01 = document.getElementById('king01Black');
                kingElement01.remove();
                document.getElementById('field03').appendChild(kingElement01);
                sourceCluster.removeChild(pieceElement);
                document.getElementById('field04').appendChild(pieceElement);
                return true;
            case "tower02Black":
                const kingElement02 = document.getElementById('king01Black');
                kingElement02.remove();
                document.getElementById('field07').appendChild(kingElement02);
                sourceCluster.removeChild(pieceElement);
                document.getElementById('field06').appendChild(pieceElement);
                return true;
            case "tower01White":
                const kingElement03 = document.getElementById('king01White');
                kingElement03.remove();
                document.getElementById('field59').appendChild(kingElement03);
                sourceCluster.removeChild(pieceElement);
                document.getElementById('field60').appendChild(pieceElement);
                return true;
            case "tower02White":
                const kingElement04 = document.getElementById('king01White');
                kingElement04.remove();
                document.getElementById('field63').appendChild(kingElement04);
                sourceCluster.removeChild(pieceElement);
                document.getElementById('field62').appendChild(pieceElement);
                return true;
            default:
                return false;
        };
    },
    executePromotion(targetCluster, pieceElement) {
        if(!pieceElement.id.includes('pawn')) return;

        if(targetCluster.id.includes('01') || targetCluster.id.includes('02') ||
        targetCluster.id.includes('03') || targetCluster.id.includes('04') ||
        targetCluster.id.includes('05') || targetCluster.id.includes('06') ||
        targetCluster.id.includes('07') || targetCluster.id.includes('08')) {
            pieceElement.remove();
            turnExecution.queenWhite.id = 'queen02White';
            targetCluster.appendChild(turnExecution.queenWhite);
        };

        if(targetCluster.id.includes('64') || targetCluster.id.includes('63') ||
        targetCluster.id.includes('62') || targetCluster.id.includes('61') ||
        targetCluster.id.includes('60') || targetCluster.id.includes('59') ||
        targetCluster.id.includes('58') || targetCluster.id.includes('57')) {
            pieceElement.remove();
            turnExecution.queenBlack.id = 'queen02Black';
            targetCluster.appendChild(turnExecution.queenBlack);
        };
    },
};