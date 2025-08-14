class userInput{
  constructor(){
    this.renderInput();
    this.connectInput();
  }

  connectInput(){
    const playerOneInputRef = document.querySelector('.user-player-one-input');
    const playerTwoInputRef = document.querySelector('.user-player-two-input');
    const playButtonRef = document.querySelector('.user-play');

    playButtonRef.addEventListener('click', () => {
      new displayController(playerOneInputRef.value, playerTwoInputRef.value);
    });
  }

  renderInput(){
    const bodyRef = document.querySelector('body');
    bodyRef.innerHTML = 
    `
    <div class = "user-container">
      <div class = "user-player-container">
        <div class = "user-player">
          <p>Player One (<span class = "blue-input">X</span>) </p>
          <input class = "user-player-one-input" type = "text">
        </div>

        <div class = "user-player">
          <p>Player Two (<span class = "red-input">O</span>) </p>
          <input class = "user-player-two-input" type = "text">
        </div>
      </div>

      <div class = "user-input-buttons">
        <button class = "user-play">Play</button>
        <a href = "../index.html"><button class = "user-back-to-home">Back To Home</button></a>
      </div>
    </div>
  `
  }
}

class storeGame{

  playerOneInfo;
  playerTwoInfo;
  boardMoves;
  winner;

  constructor(playerOneInfo, playerTwoInfo, boardMoves, winner){
    this.playerOneInfo = playerOneInfo;
    this.playerTwoInfo = playerTwoInfo;
    this.boardMoves = boardMoves;
    this.winner = winner;
    this.store();
  }

  store(){
    // localStorage destroys closures within objects
    const localStorageRef = JSON.parse(localStorage.getItem('allGames')) || [];
    let newBoard = [];

    for (let boardMoveNumber = 0; boardMoveNumber < this.boardMoves.length; boardMoveNumber++){
      let newGame = []
      let currentMove = this.boardMoves[boardMoveNumber];
      for (let rowIndex = 0; rowIndex < 3; rowIndex++){
        let newRow = []
        for (let colIndex = 0; colIndex < 3; colIndex++){
          newRow.push({
            cellValue: currentMove[rowIndex][colIndex].getCellValue(),
            colorValue: currentMove[rowIndex][colIndex].getColorValue(),
            cellSymbol: currentMove[rowIndex][colIndex].getCellSymbol(),
          })
        }
        newGame.push(newRow);
      }
      newBoard.push(newGame);
    }

    localStorageRef.push([this.playerOneInfo, this.playerTwoInfo, newBoard, this.winner]);
    localStorage.setItem('allGames', JSON.stringify(localStorageRef));
  }
}

class Board{
  rows = 3;
  columns = 3;
  board;
  moves;

  constructor(){
    this.board = [];
    this.moves = [];
    this.initializeBoard();
    this.cloneCurrentBoard();
  }

  // Initializing the board

  initializeBoard(){
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++){
      this.board.push([]);
      for (let colIndex = 0; colIndex < this.columns; colIndex++){
        this.board[rowIndex].push(Cell());
      }
    }
  }

  get board(){
    return this.board;
  }


  get moves(){
    return this.moves;
  }

  changeCell(row, column, playerValue){
    // meaning the cell already has a x and o on it already
    if (this.board[row][column].getCellValue() !== ''){
      return false;
    }

    this.board[row][column].changeCellValue(playerValue);
    this.cloneCurrentBoard();
    return true;
  };

  cloneCurrentBoard(){
    const currentMoveBoard = []
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++){
      currentMoveBoard.push([]);
      for (let colIndex = 0; colIndex < this.columns; colIndex++){
        const copyCell = Cell();
        const cellValue = this.board[rowIndex][colIndex];
        if (cellValue.getCellValue()){
          copyCell.changeCellValue(cellValue.getCellValue());
        }
        currentMoveBoard[rowIndex].push(copyCell);
      }
    }
    this.moves.push(currentMoveBoard);
  };

  // for console testing
  printBoard(){
  let printString = '';
    for (let rowIndex = 0; rowIndex < rows; rowIndex++){
      for (let colIndex = 0; colIndex < columns; colIndex++){
        printString += String(board[rowIndex][colIndex].getCellValue());
      }
      printString += '\n';
    }
    console.log(printString);
  };
}

function Cell(){
  let cellValue = '';
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
class gameController{

  playerOneName;
  playerTwoName;
  activePlayer;
  board;
  playerDB;

  constructor(playerOneName, playerTwoName){
    this.playerOneName = playerOneName;
    this.playerTwoName = playerTwoName;
    this.board = new Board();
    this.playerDB = {
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
    this.activePlayer = this.playerDB.playerOne;
  }

  checkArrayForOneValue(check){
    let firstValue = check[0].getCellValue();
    let testArray = check.filter(cellMate => cellMate.getCellValue() === firstValue);
    // because, all 3 values would be the same to each other 
    return testArray.length === 3 && firstValue !== '';
  };

  checkForWins(){
    const boardReplica = this.getBoard();

    // Check for row wins
    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
      let winValue = this.checkArrayForOneValue(boardReplica[rowIndex]);
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
      let winValue = this.checkArrayForOneValue(newCol);
      if (winValue){
        return true;
      }
    }


    // Check for diag or return false -> if either of them fail, return false, as we checked all possible ways to win
    return this.checkArrayForOneValue([boardReplica[0][0], boardReplica[1][1], boardReplica[2][2]]) || this.checkArrayForOneValue([boardReplica[0][2], boardReplica[1][1], boardReplica[2][0]]);
  };

  checkIfFilled(){
    const boardReplica = this.getBoard();

    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
      for (let colIndex = 0; colIndex < 3; colIndex++){
        if (boardReplica[rowIndex][colIndex].getCellValue() === ''){
          return false;
        }
      }
    }
    return true;
  }

  swapActivePlayers = () => {
    this.activePlayer = this.activePlayer === this.playerDB.playerOne ? this.playerDB.playerTwo : this.playerDB.playerOne;
  }

  getActivePlayer = () => this.activePlayer;

  // The board will have an eventlistener for each button, allowing it to pass row and col params
  actionOnBoard(row, column){
    // Prevents user from pressing after wins
    let validMove = this.board.changeCell(row, column, this.activePlayer.value);
    if (validMove){
      const winCheck = this.checkForWins();
      const fillCheck = this.checkIfFilled();
      if (winCheck){
        const playerStatusRef = document.querySelector('.player-status');
        playerStatusRef.innerHTML = ``;
        const playerStatusRefHTML =
        `
        <p class = "${this.activePlayer.color}-player-status-text result-text">
        ${this.activePlayer.name} (${this.activePlayer.color}) won! 
        </p>
        `;
        playerStatusRef.innerHTML = playerStatusRefHTML;

        const boardRef = document.querySelector('.board');
        boardRef.innerHTML = ``;

        this.reset();
      }
      else if (fillCheck && !winCheck){
        const playerStatusRef = document.querySelector('.player-status');
        playerStatusRef.innerHTML = ``;
        const playerStatusRefHTML =
        `
        <p class = "result-text">
        Stalemate.
        </p>
        `;
        playerStatusRef.innerHTML = playerStatusRefHTML;

        const boardRef = document.querySelector('.board');
        boardRef.innerHTML = ``;

        this.reset();
      }
      else{
        this.swapActivePlayers();
      }
    }
  };

  getBoard = () => this.board.board;

  reset(){

    const buttonAftermathRef = document.createElement('div');
    buttonAftermathRef.classList.add('button-aftermath');
    const buttonAftermathRefInnerHTML =
    `
    <button class = "button-reset-aftermath">
      Reset
    </button>

    <a href = "../index.html">
      <button class = "button-home-aftermath">
        Go Back To Home
      </button>
    </a>
    `;
    buttonAftermathRef.innerHTML = buttonAftermathRefInnerHTML;

    const gameRef = document.querySelector('.tic-tac-toe-game');
    gameRef.appendChild(buttonAftermathRef);

    
    const buttonResetRef = document.querySelector('.button-reset-aftermath');
    buttonResetRef.addEventListener('click', () => {
      buttonAftermathRef.remove();
      new userInput();
    });

    new storeGame(this.playerDB.playerOne, this.playerDB.playerTwo, this.board.moves, this.gameResult);
  };
}

class displayController{

  playerOneName;
  playerTwoName;
  game;

  constructor(playerOneName = "Player One", playerTwoName = "Player Two"){
    this.playerOneName = playerOneName;
    this.playerTwoName = playerTwoName;
    this.game = new gameController(playerOneName, playerTwoName);
    this.renderBody();
    this.renderBoard();
  }

  renderBody(){
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
  }

  renderBoard(){
    const playerStatusRef = document.querySelector('.player-status');
    const boardRef = document.querySelector('.board');

    // Change the Player Turn Notifier
    const playerStatusRefHTML =
    `
    <p class = "turn-status">
      Turn: <span class = "${this.game.getActivePlayer().color}-player-status-text">${this.game.getActivePlayer().name}</span>
    </p>
    `;
    playerStatusRef.innerHTML = playerStatusRefHTML;

    // Change the board
    const board = this.game.getBoard();

    // Clear the board
    boardRef.innerHTML = ``;

    let boardHTML = ``;

    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
      for (let colIndex = 0; colIndex < 3; colIndex++){
        boardHTML +=
        `
        <div class = "cell">
          <button class = "button-${rowIndex}-${colIndex}">
            <p class = "${board[rowIndex][colIndex].getColorValue()}-cell">
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
        this.addActionClick(rowIndex, colIndex, `button-${rowIndex}-${colIndex}`);
      }
    }
  }

  addActionClick(row, column, buttonId){
    const buttonRef = document.querySelector(`.${buttonId}`);
    buttonRef.addEventListener('click', () =>{
      this.game.actionOnBoard(row, column);
      if (!this.game.checkForWins() && !(this.game.checkIfFilled() && !this.game.checkForWins())){
        this.renderBoard();
      }
    });
  };
}

new userInput();