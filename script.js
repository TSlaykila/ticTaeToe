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

    return {getBoard, resetboard, placeMarker}
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
        console.log("Game has Started")
    };

   

    function switchTurn(){
        if (turn === 0) {
            turn = 1;
        } else {
            turn = 0;
        }
        console.log(`It's now ${Players.getPlayers()[turn].name}'s turn`);
    }
    

    function isTie() {
        return Gameboard.getBoard().flat().every(cell => cell !== "");
    }

    function checkWinner(){
        let marker = Players.getMarker(turn);
        let board = Gameboard.getBoard()
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
        }

        function makeMove(row, col){
            if (gameOver) {
                console.log("Game over! Start a new gameOver.")
            }

            let plotted = Gameboard.placeMarker(row, col, Players.getMarker(turn));
            if (plotted) {
                if (isTie()){
                    gameOver = true
                };
                if (checkWinner()){
                    gameOver = true
                };
                
                switchTurn();
            } else {
                console.log("Invalid Move! Spot already taken.")
            }
        }

    return {startgame,switchTurn, checkWinner, makeMove, isTie}
})();