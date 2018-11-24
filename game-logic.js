//I will tell you how to move.
//I just need your position JSON,
//and where do you want to move
var spriteChange = {"Up" : "Back", "Down" : "Front", "Left" : "Left", "Right" : "Right"}
var positionChange = {
                        "Up" : function(gameStatus, matrixBoard){
                            if(matrixBoard[gameStatus.Player.PositionX][gameStatus.Player.PositionY - 1] == 'O'){
                                    gameStatus.Player.PositionY = gameStatus.Player.PositionY - 1;
                            } else {
                                if(gameStatus.Player.PositionY - 2 > 0 &&
                                    matrixBoard[gameStatus.Player.PositionX][gameStatus.Player.PositionY - 2] == 'O'){
                                    gameStatus.Boxes[matrixBoard[gameStatus.Player.PositionX][gameStatus.Player.PositionY - 1]].PositionY--;
                                    matrixBoard[gameStatus.Player.PositionX][gameStatus.Player.PositionY - 2] = 0
                                    matrixBoard[gameStatus.Player.PositionX][gameStatus.Player.PositionY -1] = 'O' 
                                    gameStatus.Player.PositionY--;
                                }
                            }
                                                          
                            return gameStatus;
                        },
                        
                        "Down" : function(gameStatus, matrixBoard){
                            if(matrixBoard[gameStatus.Player.PositionX][gameStatus.Player.PositionY + 1] == 'O'){
                                gameStatus.Player.PositionY = gameStatus.Player.PositionY + 1;
                            } else {
                                if(gameStatus.Player.PositionY + 2 < gameStatus.Size[1] &&
                                    matrixBoard[gameStatus.Player.PositionX][gameStatus.Player.PositionY + 2] == 'O'){
                                    gameStatus.Boxes[matrixBoard[gameStatus.Player.PositionX][gameStatus.Player.PositionY + 1]].PositionY++;
                                    matrixBoard[gameStatus.Player.PositionX][gameStatus.Player.PositionY + 2] = 0
                                    matrixBoard[gameStatus.Player.PositionX][gameStatus.Player.PositionY + 1] = 'O' 
                                    gameStatus.Player.PositionY++;
                                }
                            }
                        
                            return gameStatus;
                        },
                        "Right" : function(gameStatus, matrixBoard){
                            if(matrixBoard[gameStatus.Player.PositionX + 1][gameStatus.Player.PositionY] == 'O'){
                                gameStatus.Player.PositionX = gameStatus.Player.PositionX + 1;
                            } else {
                                if(gameStatus.Player.PositionX + 2 < gameStatus.Size[0] &&
                                    matrixBoard[gameStatus.Player.PositionX + 2][gameStatus.Player.PositionY] == 'O'){
                                    gameStatus.Boxes[matrixBoard[gameStatus.Player.PositionX + 1][gameStatus.Player.PositionY]].PositionX++;
                                    matrixBoard[gameStatus.Player.PositionX + 2][gameStatus.Player.PositionY] = 0
                                    matrixBoard[gameStatus.Player.PositionX + 1][gameStatus.Player.PositionY] = 'O' 
                                    gameStatus.Player.PositionX++;
                                }
                            }
                
                            return gameStatus;
                        },
                        "Left" : function(gameStatus, matrixBoard){
                            if(matrixBoard[gameStatus.Player.PositionX - 1][gameStatus.Player.PositionY] == 'O'){
                                gameStatus.Player.PositionX = gameStatus.Player.PositionX - 1;
                            } else {
                                if(gameStatus.Player.PositionX - 2 > 0 &&
                                    matrixBoard[gameStatus.Player.PositionX - 2][gameStatus.Player.PositionY] == 'O'){
                                    gameStatus.Boxes[matrixBoard[gameStatus.Player.PositionX - 1][gameStatus.Player.PositionY]].PositionX--;
                                    matrixBoard[gameStatus.Player.PositionX - 2][gameStatus.Player.PositionY] = 0
                                    matrixBoard[gameStatus.Player.PositionX - 1][gameStatus.Player.PositionY] = 'O' 
                                    gameStatus.Player.PositionX--;
                                }
                            }
                            
                            return gameStatus;
                        }};

exports.updateGame = function(gameStatus, action){

    var matrixBoard = gameStatusAsBoard(gameStatus.Board);
    //No matter if the user is able to move or not, the sprite changes
    gameStatus.Board.Player.Sprite = spriteChange[action];
    gameStatus.Board =  positionChange[action](gameStatus.Board, matrixBoard);
    gameStatus.Game = haveIWon(gameStatus, matrixBoard);
    gameStatus.Movements++;
    return gameStatus;
}

function haveIWon(gameStatus, matrix){
    var gameWon = true;
    gameStatus.Board.Marker.forEach(element => {
        if(matrix[element.PositionX][element.PositionY] == 'O'){
            gameWon = false;
        }
    });
    return gameWon;
}

function gameStatusAsBoard(gameStatus){
    //TODO, avoid magix numbers
    var matrix = Array(gameStatus.Size[0]).fill(null).map(() => Array(gameStatus.Size[1]).fill('O'));
    var inx = 0;
    
    gameStatus.Boxes.forEach(element => {
        matrix[element.PositionX][element.PositionY] = inx;
        inx = inx + 1;
    });
    gameStatus.Limits.forEach(element => {
        matrix[element.PositionX][element.PositionY] = 'X';
    });
    return matrix;
}