function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (row, column, player) => {
        if (board[row][column].getValue() != 0) {
            return false;
        }
        board[row][column].addToken(player);
        return true;
    };

    const cleanBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    };

    // for the console only
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return { 
        board, 
        getBoard, 
        placeToken, 
        printBoard,
        cleanBoard
    }
}

function Cell() {
    let value = "";

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addToken, getValue };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();
    const players = [
        {
            name: playerOneName,
            token: "X"
        },
        {
            name: playerTwoName,
            token: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    // const printNewRound = () => {
    //     board.printBoard();
    //     console.log(`${getActivePlayer().name}'s turn.`)
    // };

    const checkWinCondition = () => {
        const tempBoard = board.getBoard();
        let win = false;
        // check rows
        for (let i = 0; i < 3; i++) {
            if (tempBoard[i][0].getValue() !== "" && tempBoard[i][0].getValue() === tempBoard[i][1].getValue() && tempBoard[i][0].getValue() === tempBoard[i][2].getValue()) {
                win = true;
            }
        }

        // check columns
        for (let i = 0; i < 3; i++) {
            if (tempBoard[0][i].getValue() !== "" && tempBoard[0][i].getValue() === tempBoard[1][i].getValue() && tempBoard[0][i].getValue() === tempBoard[2][i].getValue()) {
                win = true;
            }
        }

        // check diagonals
        if (tempBoard[0][0].getValue() !== "" && tempBoard[0][0].getValue() === tempBoard[1][1].getValue() && tempBoard[0][0].getValue() === tempBoard[2][2].getValue()) {
            win = true;
        }
        if (tempBoard[0][2].getValue() !== "" && tempBoard[0][2].getValue() === tempBoard[1][1].getValue() && tempBoard[0][2].getValue() === tempBoard[2][0].getValue()) {
            win = true;
        }

        return win;
    };

    const playRound = (row, column) => {
        console.log(`Placing ${getActivePlayer().name}'s token at row ${row} and col ${column}...`);
        if (!board.placeToken(row, column, getActivePlayer().token)) {
            console.log("Can't place that there.");
            return;
        }

        // check for win condition here
        if (checkWinCondition()) {
            console.log(`Game over. ${getActivePlayer().name} wins!`);
            board.printBoard();
            return;
        }

        switchPlayerTurn();
    }

    const reset = () => {
        board.cleanBoard();
        if (activePlayer !== players[0]) {
            switchPlayerTurn();
        }
    };

    return { 
        playRound, 
        getActivePlayer, 
        getBoard: board.getBoard,
        checkWinCondition,
        reset
    }
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const resetButton = document.querySelector(".reset");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        if (game.checkWinCondition()) {
            playerTurnDiv.textContent = `${activePlayer.name} wins!`;
            boardDiv.style.backgroundColor = "blue";
        } else {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn.`;
            boardDiv.style.backgroundColor = "red";
        }

        for (let i = 0; i < 3; i ++) {
            for (let j = 0; j < 3; j++) {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                cellButton.textContent = board[i][j].getValue();
                boardDiv.appendChild(cellButton);
            }
        }
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedCol = e.target.dataset.column;

        if (!selectedCol || !selectedRow) {
            return;
        }

        if (game.checkWinCondition()) {
            return;
        }

        game.playRound(selectedRow, selectedCol);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    resetButton.addEventListener("click", () => {
        game.reset();
        updateScreen();
    });

    updateScreen();
};

ScreenController();