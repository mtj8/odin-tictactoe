// gameboard holds board state in IIFE
const Gameboard = (function() {
    const rows = 3;
    const columns = 3;
    const blank = ".";
    const board = [];
    const ttt = document.getElementById("tictactoe");

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const box = document.createElement("div");
            box.dataset.row = i;
            box.dataset.col = j;

            ttt.appendChild(box);
        }
    }
    
    // create a 2d array for the board, and the display for the board
    const createBoard = () => {
        // tic tac toe board
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(blank);
            }
        }

        return board;
    }


    // get the board state
    const getBoard = () => {
        return board;
    }

    // update the board state
    const updateBoard = (row, column, player) => {
        if (board[row][column] == blank) {
            board[row][column] = player.playerSymbol;
            return true;
        }
        else {
            return false;
        }
    }

    // temp print board
    const printBoard = () => {
        for (let i = 0; i < rows; i++) {
            console.log(board[i]);
        }
    }

    // check board state for winner
    // cba just do this brute force,
    // it's not connect four or anything
    const checkBoard = (player) => {
        let winner = null;

        const allEqual = (arr) => arr.every(a => a === arr[0] && arr[0] !== blank);
        // row
        const rowOne = [board[0][0], board[0][1], board[0][2]];
        const rowTwo = [board[1][0], board[1][1], board[1][2]];
        const rowThree = [board[2][0], board[2][1], board[2][2]];

        // col
        const colOne = [board[0][0], board[1][0], board[2][0]];
        const colTwo = [board[0][1], board[1][1], board[2][1]];
        const colThree = [board[0][2], board[1][2], board[2][2]];

        // diagonal
        const diagOne = [board[0][0], board[1][1], board[2][2]];
        const diagTwo = [board[0][2], board[1][1], board[2][0]];
        
        const winConditions = [
            rowOne, rowTwo, rowThree, colOne, colTwo, colThree, diagOne, diagTwo
        ];

        let winnerCheck = winConditions.filter(arr => allEqual(arr));
        return winnerCheck.length !== 0;
    }

    return { blank, ttt, board, 
        createBoard, getBoard, updateBoard, printBoard, checkBoard, };
})();



// Player holds player state (not IIFE, reusable factory)
function createPlayer(name, symbol) {
    const playerName = name;
    const playerSymbol = symbol;
    return { playerName, playerSymbol };
}



// Controller holds game in IIFE
// this calls the gameboard and two players
const Controller = (function() {

    // board state
    let board = null;
    let winner = false;
    let currentPlayer = null;
    let players = new Array();

    // start a game
    const initGame = (playerOneName, playerTwoName) => {
        board = Gameboard.createBoard();
        
        // players
        const playerOne = createPlayer(playerOneName, "X");
        const playerTwo = createPlayer(playerTwoName, "O");
        players = [playerOne, playerTwo];

        // game logic
        // player 1 first, then swap players
        currentPlayer = players[0];

        // add event listeners to boxes to make game
        const boxes = Gameboard.ttt.getElementsByTagName("div");
        Array.from(boxes).forEach((box) => {
            const row = box.dataset.row;
            const col = box.dataset.col;
            console.log(row, col);
            box.addEventListener("click", () => {
                console.log(getPlayer());
                makeMove(row, col, getPlayer());
            });
        })
    }
    
    // display game
    const displayGame = () => {
        const boxes = Gameboard.ttt.getElementsByTagName("div");
        Array.from(boxes).forEach((box) => {
            const row = box.dataset.row;
            const col = box.dataset.col;
            if (board[row][col] != Gameboard.blank) {
                box.textContent = board[row][col];
            }  
        });
    };

    const getPlayer = () => {
        return currentPlayer;
    };
    
    const nextPlayer = () => { 
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0]
    };

    const makeMove = (row, column, player) => {
        console.log(`Marking ${player.playerSymbol} at ${row} ${column}`);
        if (!Gameboard.updateBoard(row, column, player)) {
            console.log("Invalid move.");
            return;
        }

        // update display
        displayGame();

        // check for winner
        winner = Gameboard.checkBoard(getPlayer());
        if (winner) {
            const winnerText = document.getElementById("winner");
            winnerText.textContent = `winner: ${getPlayer().playerName}`;
            return;
        }

        // check for full board
        const fullBoard = board.flat().every(x => x != Gameboard.blank);
        if (fullBoard) {
            console.log(`Board is full!`);
            return;
        }

        // next turn
        nextPlayer();
    }

    return { board, winner, currentPlayer,
        initGame, getPlayer, makeMove,
    }

})();

Controller.initGame(0, 1);