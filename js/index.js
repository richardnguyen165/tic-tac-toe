function Board(){
  const rows = 3, columns = 3;

  const board = [];

  // Initializing the board

  for (let rowIndex = 0; rowIndex < rows; rowIndex++){
    board.push([]);
    for (let colIndex = 0; colIndex < columns; colIndex++){
      board[rowIndex].push(cellValue);
    }
  }

  const getBoard = () => board;

  const changeCell = (row, column, playerValue) => {
    // meaning the cell already has a x and o on it already
    if (!board[row][column].getCellValue()){
      return;
    }

    board[row][column].changeCellValue(playerValue);
  };

  // for console testing
  const printBoard = () => {
  let printString = '';
    for (let rowIndex = 0; rowIndex < rows; rowIndex++){
      for (let colIndex = 0; colIndex < columns; colIndex++){
        printString += String(board[rowIndex][colIndex].getCellValue());
      }
      printString += '\n';
    }
    console.log(printString);
  };

  return {getBoard, changeCell, printBoard}
}

function Cell(){
  let cellValue = 0;

  const changeCellValue = (playerValue) => cellValue = playerValue;
  
  const getCellValue = () => cellValue;

  return {changeCellValue, getCellValue};
}

// default parameters for naming
function gameController(playerOneName = "Player One", playerTwoName = "Player Two") {

  const playerDB = {
    playerOne : {
      playerOneName,
      value: 1
    },
    playerTwo : {
      playerTwoName,
      value : 2
    }
  }

  const board = Board();
  const activePlayer = playerDB.playerOne;

  const checkArrayForOneValue = (check) => {
    let firstValue = check[0].getCellValue();
    let testArray = check.filter(cellMate => cellMate.getCellValue() === firstValue);
    // because, all 3 values would be the same to each other 
    return testArray.length === 3 && firstValue !== 0;
  };

  const checkForWins = () => {
    const boardReplica = board.getBoard;

    // Check for row wins
    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
      let winValue = checkArrayForOneValue(boardReplica[rowIndex]);
      if (winValue){
        // we dont need to return the winning player, the ones that active IS the winning player
        return true;
      }
    }

    // Check for col wins
    for (let colIndex = 0; colIndex < 3; colIndex++){
      let newCol = [];
      for (let rowIndex = 0; rowIndex < 3; rowIndex++){
        newCol.push(boardReplica[rowIndex][colIndex]);
      }
      let winValue = checkArrayForOneValue(newCol);
      if (winValue){
        return true;
      }
    }


    // Check for diag or return false -> if either of them fail, return false, as we checked all possible ways to win
    return checkArrayForOneValue([boardReplica[0][0], boardReplica[1][1], boardReplica[2][2]]) || checkArrayForOneValue([boardReplica[0][2], boardReplica[1][1], boardReplica[2][0]]);
  };

  const swapActivePlayers = () => {
    activePlayer = activePlayer === playerDB.playerOne ? playerDB.playerTwo : playerDB.playerOne;
  }

  const getActivePlayer = () => activePlayer;

  // The board will have an eventlistener for each button, allowing it to pass row and col params
  const actionOnBoard = (row, column) => {
    board.changeCell(row, column, activePlayer.value);
    const winCheck = checkForWins();
    if (!winCheck){
      swapActivePlayers();
    }
    // the value of winCheck will communicate to displayController()
    return winCheck;
  };

  return {actionOnBoard, getActivePlayer};
}


