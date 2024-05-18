import { data } from "../data";
"use strict";

// Add Events to the board for the selecting the pieces.
const selectors = {
    htmlBoard: document.querySelectorAll('.fieldCluster'),
    addEventsToBoard: function() {
        selectors.htmlBoard.forEach((cluster) => {
            cluster.addEventListener('click', selectPiece);
        })
    },
    removeEventsToBoard: function() {
        selectors.htmlBoard.forEach((cluster) => {
            cluster.removeEventListener('click', selectPiece);
        })
    },
};

function selectPiece() {

    if(checkValidTurn() === 0) return;

    calculateValidMoves(cluster.children[0].id);
};

// Check if the Field is valid to select from the Player
function checkValidTurn() {

    let pass = 0

    if(data.round % 2 !== 0) {
            if(cluster.children[0]?.id.slice(-5) === 'White' ) return pass = 1
    };

    if(data.round % 2 === 0) {
        if(cluster.children[0]?.id.slice(-5) === 'Black' ) return pass = 1
    };

    return pass;

};


