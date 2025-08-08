function userInput(){
  const connectInput = () => {
    const playerOneInputRef = document.querySelector('.user-player-one-input');
    const playerTwoInputRef = document.querySelector('.user-player-two-input');
    const playButtonRef = document.querySelector('.user-play');

    playButtonRef.addEventListener('click', () => {
      if (!playerOneInputRef.value){
        alert('Enter Player One Name!');
      }
      else if (!playerTwoInputRef.value){
        alert('Enter Player Two Name!');
      }
      else{
        displayController(playerOneInputRef.value, playerTwoInputRef.value);
      }
    });
  }

  const bodyRef = document.querySelector('body');
  bodyRef.innerHTML = 
  `
  <div class = "user-container">
    <div class = "user-player-container">
      <div class = "user-player">
        <p>Player One</p>
        <input class = "user-player-one-input" type = "text">
      </div>

      <div class = "user-player">
        <p>Player Two</p>
        <input class = "user-player-two-input" type = "text">
      </div>
    </div>

    <div class = "user-input-buttons">
      <button class = "user-play">Play</button>
      <a href = "../index.html"><button class = "user-back-to-home">Back To Home</button></a>
    </div>
  </div>
  `
  connectInput();
}

function Board(){
  const rows = 3, columns = 3;

  const board = [];

  // Initializing the board

  for (let rowIndex = 0; rowIndex < rows; rowIndex++){
    board.push([]);
    for (let colIndex = 0; colIndex < columns; colIndex++){
      board[rowIndex].push(Cell());
    }
  }
  const getBoard = () => board;

  const changeCell = (row, column, playerValue) => {
    // meaning the cell already has a x and o on it already
    if (board[row][column].getCellValue() !== 0){
      return false;
    }

    board[row][column].changeCellValue(playerValue);
    return true;
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
  let colorValue = '';
  let cellSymbol = '';

  const changeCellValue = (playerValue) => {
    cellValue = playerValue;
    colorValue = playerValue === 1 ? "blue" : "red";
    cellSymbol = playerValue === 1 ? "X" : "O";
  };
  
  const getCellValue = () => cellValue;

  const getColorValue = () => colorValue;

  const getCellSymbol = () => cellSymbol;

  return {changeCellValue, getCellValue, getColorValue, getCellSymbol};
}

// default parameters for naming
function gameController(playerOneName, playerTwoName) {

  const playerDB = {
    playerOne : {
      name: playerOneName,
      value: 1,
      symbol: "X",
      color: "Blue"
    },
    playerTwo : {
      name: playerTwoName,
      value : 2,
      symbol: "O",
      color: "Red"
    }
  }

  const board = Board();
  let activePlayer = playerDB.playerOne;

  const checkArrayForOneValue = (check) => {
    let firstValue = check[0].getCellValue();
    let testArray = check.filter(cellMate => cellMate.getCellValue() === firstValue);
    // because, all 3 values would be the same to each other 
    return testArray.length === 3 && firstValue !== 0;
  };

  const checkForWins = () => {
    const boardReplica = board.getBoard();

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

  const checkIfFilled = () => {
    const boardReplica = board.getBoard();

    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
      for (let colIndex = 0; colIndex < 3; colIndex++){
        console.log()
        if (boardReplica[rowIndex][colIndex].getCellValue() === 0){
          return false;
        }
      }
    }
    return true;
  }

  const swapActivePlayers = () => {
    activePlayer = activePlayer === playerDB.playerOne ? playerDB.playerTwo : playerDB.playerOne;
  }

  const getActivePlayer = () => activePlayer;

  // The board will have an eventlistener for each button, allowing it to pass row and col params
  const actionOnBoard = (row, column) => {
    // Prevents user from pressing after wins
    let validMove = board.changeCell(row, column, activePlayer.value);
    if (validMove){
      swapActivePlayers();
      board.printBoard();
      if (checkForWins()){
        const playerStatusRef = document.querySelector('.player-status');
        playerStatusRef.innerHTML = ``;
        const playerStatusRefHTML =
        `
        <p>
        ${activePlayer.name} (${activePlayer.color}) won! 
        </p>
        `;
        playerStatusRef.innerHTML = playerStatusRefHTML;

        const boardRef = document.querySelector('.board');
        boardRef.innerHTML = ``;

        reset();
      }
      else if (checkIfFilled() && !checkForWins()){
        const playerStatusRef = document.querySelector('.player-status');
        playerStatusRef.innerHTML = ``;
        const playerStatusRefHTML =
        `
        <p>
        Stalemate.
        </p>
        `;
        playerStatusRef.innerHTML = playerStatusRefHTML;

        const boardRef = document.querySelector('.board');
        boardRef.innerHTML = ``;

        reset();
      }
    }
    else{
      console.log('Invalid move: chose occupied square')
    }
  };

  const getBoard = () => board.getBoard();

  const reset = () => {

    const buttonAftermathRef = document.createElement('div');
    buttonAftermathRef.classList.add('button-aftermath');
    const buttonAftermathRefInnerHTML =
    `
    <button class = "button-reset">
      Reset
    </button>

    <button>
      Go Back To Home
    </button>
    `;
    buttonAftermathRef.innerHTML = buttonAftermathRefInnerHTML;

    const gameRef = document.querySelector('.tic-tac-toe-game');
    gameRef.appendChild(buttonAftermathRef);

    const buttonResetRef = document.querySelector('.button-reset');
    buttonResetRef.addEventListener('click', () => {
      buttonAftermathRef.remove();
      displayController();
    });
  };

  return {actionOnBoard, getActivePlayer, getBoard, checkForWins};
}

function displayController(playerOneName = "Player One", playerTwoName = "Player Two"){
  //html linkers

  const game = gameController(playerOneName, playerTwoName);

  const renderBoard = () => {
    const playerStatusRef = document.querySelector('.player-status');
    const boardRef = document.querySelector('.board');

    // Change the Player Turn Notifier
    const playerStatusRefHTML =
    `
    <p>
      Turn: ${game.getActivePlayer().name}
    </p>
    `;
    playerStatusRef.innerHTML = playerStatusRefHTML;

    // Change the board
    const board = game.getBoard();

    // Clear the board
    boardRef.innerHTML = ``;

    let boardHTML = ``;

    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
      for (let colIndex = 0; colIndex < 3; colIndex++){
        boardHTML +=
        `
        <div class = "cell">
          <button class = "button-${rowIndex}-${colIndex}">
            <p class = "${board[rowIndex][colIndex].getColorValue()}">
              ${board[rowIndex][colIndex].getCellSymbol()}
            </p>
          </button>
        </div>
        `;
      }
    }
    boardRef.innerHTML = boardHTML;

    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
      for (let colIndex = 0; colIndex < 3; colIndex++){
        addActionClick(rowIndex, colIndex, `button-${rowIndex}-${colIndex}`);
      }
    }
  }

  const addActionClick = (row, column, buttonId) => {
    const buttonRef = document.querySelector(`.${buttonId}`);
    buttonRef.addEventListener('click', () =>{
      game.actionOnBoard(row, column);
      if (!game.checkForWins()){
        renderBoard();
      }
    });
  };

  const bodyRef = document.querySelector('body');
  bodyRef.innerHTML = 
  `
  <div class = "container">
    <div class = "tic-tac-toe-title-container">
      <div class = "tic-tac-toe-title">
        Tic-Tac-Toe
      </div>
    </div>

    <div class = "tic-tac-toe-game-container">
      <div class = "tic-tac-toe-game">
        <div class = "player-status"></div>
        <div class = "board"></div>
      </div>
    </div>
  </div>
  `
  renderBoard();
}

userInput();