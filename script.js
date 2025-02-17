const Gameboard = (function(){
    let board =
    [["","",""]
    ,["","",""]
    ,["","",""]];

    function getBoard() {
        return board;
    }

    function resetboard() { 
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = "";
            }
        }
    }
    

    function placeMarker(row, col, marker) {
        if (board[row][col] == "") {
            board[row][col] = marker;
            return true
        }
        return false

    }

    function printBoard() {
        console.log("\n");
        board.forEach(row => console.log(row.join(" | ")));
        console.log("\n");
    }
    return {getBoard, resetboard, placeMarker, printBoard}
})();

const Players = (function(){
    let players = [
        {name: "Player 1" , marker: "X"},
        {name: "Player 2" , marker: "O"} 
    ]

    function getPlayers(index){
        return players[index]
    }

    function getMarker(index){
        return players[index]?.marker ?? null;
    }

    return {getPlayers, getMarker}
})();

const Game = (function(){
    let turn = 0;
    let gameOver = false;

    function startgame(){
        Gameboard.resetboard();
        turn = 0;
        gameOver = false;
    };

   

    function switchTurn(){
        if (turn === 0) {
            turn = 1;
        } else {
            turn = 0;
        }
    }
    

    function isTie() {
        return Gameboard.getBoard().flat().every(cell => cell !== "");
    }

    function checkWinner(){
        let marker = Players.getMarker(turn);
        let board = Gameboard.getBoard();
        for (let j = 0; j < 3; j++) {
            let points = 0
            //checks vertical winner
            for (let i = 0; i < 3; i++) {
                if(board[i][j] == marker){
                    points += 1
                    if(points == 3){
                        console.log(`${Players.getPlayers(turn).name} is the winner`)
                        return  true

                    }
                }
            }
        }

        for (let j = 0; j < 3; j++) {
            let points = 0
            // checks horizontal winner
            for (let i = 0; i < 3; i++) {
                if(board[j][i] == marker){
                    points  += 1
                    if(points == 3){
                        console.log(`${Players.getPlayers(turn).name} is the winner`)
                        return  true
                    }
                }
                }
        }
            points = 0
            // checks diagonal winner
            for (let i = 0; i < 3; i++){
                if(board[i][i] == marker){
                    points += 1
                    if(points == 3){
                        console.log(`${Players.getPlayers(turn).name} is the winner`)
                        return true
                    }
                }
            }

            points = 0
            // checks diagonal winner
            let j = 0
            for (let i = 2; i >= 0; i--){
                if(board[j][i] == marker){
                    points += 1
                    if(points == 3){
                        console.log(`${Players.getPlayers(turn).name} is the winner`)
                        return true
                    }
                }
                j++
            }
            return false;
        }

        function makeMove(row, col){
            if (gameOver) {return};

               
                let plotted = Gameboard.placeMarker(row, col, Players.getMarker(turn));
                if (plotted) {
                    if (checkWinner()) {  // If someone wins, stop checking for ties
                        gameOver = true;
                    } else if (isTie()) {  // Only check for a tie if no one has won
                        gameOver = true;
                    } else {
                        switchTurn();
                    }
                }
                    
                DisplayController.updateMessage();

                }
            
             

        function getTurn(){
            return turn;
        }

    return {startgame, switchTurn, checkWinner, makeMove, isTie, getTurn}
})();

const DisplayController = (function () {
    const boardElement = document.querySelector(".board")
    const messageElement = document.querySelector(".message")
    const restartButton = document.querySelector(".restart")

    function renderBoard(){
        boardElement.innerHTML = ""
        let board = Gameboard.getBoard();
    

    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;
            cellElement.textContent = cell;
            
            // Disable clicking if already taken
            if (cell !== "") {
                cellElement.classList.add("taken");
            }

            cellElement.addEventListener("click", handleCellClick)
            boardElement.appendChild(cellElement)
        });
    });
    }

    function handleCellClick(event) {
        let row = event.target.dataset.row;
        let col = event.target.dataset.col;

        if (!event.target.classList.contains("taken")) {
            Game.makeMove(parseInt(row), parseInt(col));
            renderBoard();
            updateMessage();
        }
    }

    function updateMessage() {
        if (Game.checkWinner ()) {
            messageElement.textContent = `${Players.getPlayers(Game.getTurn()).name} Wins!`
        } else if (Game.isTie()) {
            messageElement.textContent = "It's a Tie!";
        } else {
            messageElement.textContent = `Player ${Players.getMarker(Game.getTurn())}'s turn`
        }
    }

    function restartGame() {
        Game.startgame();
        renderBoard();
        updateMessage();
    }

    restartButton.addEventListener("click", restartGame);

    return {renderBoard, updateMessage};

})();

Game.startgame();
DisplayController.renderBoard();