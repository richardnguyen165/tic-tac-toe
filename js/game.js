/* This is a JS file for the input, game and aftermath sections */

// Responsible for showing the user input for users to interact with
class userInput{
  // Runs these functions to ensure the input is shown and working
  constructor(){
    this.renderInput();
    this.connectInput();
  }

  // Gets values from the inputs and creates a new displayController object to start the game
  connectInput(){
    const playerOneInputRef = document.querySelector('.user-player-one-input');
    const playerTwoInputRef = document.querySelector('.user-player-two-input');
    const playButtonRef = document.querySelector('.user-play');

    playButtonRef.addEventListener('click', () => {
      new displayController(playerOneInputRef.value, playerTwoInputRef.value);
    });
  }

  // Generates HTML to help display the user input screen
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

// Responsible for storing player info, all board moves, and the winner into local storage so that they can be viewed in match history catalogue
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

    // Decomplies the board because in localStorage, objects and functions break
    for (let boardMoveNumber = 0; boardMoveNumber < this.boardMoves.length; boardMoveNumber++){
      let newGame = []
      let currentMove = this.boardMoves[boardMoveNumber];
      for (let rowIndex = 0; rowIndex < 3; rowIndex++){
        let newRow = []
        for (let colIndex = 0; colIndex < 3; colIndex++){
          newRow.push({
            cellValue: currentMove[rowIndex][colIndex].cellValue,
            colorValue: currentMove[rowIndex][colIndex].colorValue,
            cellSymbol: currentMove[rowIndex][colIndex].cellSymbol,
          })
        }
        newGame.push(newRow);
      }
      newBoard.push(newGame);
    }

    // Stores into localStorage
    localStorageRef.push([this.playerOneInfo, this.playerTwoInfo, newBoard, this.winner]);
    localStorage.setItem('allGames', JSON.stringify(localStorageRef));
  }
}

// Responsible for the board (where users click on the board, and the game pretty much occurs on there)
class Board{
  rows = 3;
  columns = 3;
  _board;
  _moves;

  constructor(){
    this._board = [];
    this._moves = [];
    // initalizing board, and moving the new board into moves as the first step
    this.initializeBoard();
    this.cloneCurrentBoard();
  }

  // Initializing the board

  initializeBoard(){
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++){
      this._board.push([]);
      for (let colIndex = 0; colIndex < this.columns; colIndex++){
        this._board[rowIndex].push(new Cell());
      }
    }
  }

  // changing the cell of the board from a blank to an occupied one
  changeCell(row, column, playerValue){
    // meaning the cell already has a x and o on it already
    if (this._board[row][column].cellValue !== ''){
      return false;
    }

    this._board[row][column].changeCellValue(playerValue);
    this.cloneCurrentBoard();
    return true;
  };

  // clones board, as we need to create new cell instances (or as they will reference each other, causing the moves to be lost)
  cloneCurrentBoard(){
    const currentMoveBoard = []
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++){
      currentMoveBoard.push([]);
      for (let colIndex = 0; colIndex < this.columns; colIndex++){
        const copyCell = new Cell();
        const cellValue = this._board[rowIndex][colIndex];
        if (cellValue.cellValue){
          copyCell.changeCellValue(cellValue.cellValue);
        }
        currentMoveBoard[rowIndex].push(copyCell);
      }
    }
    this._moves.push(currentMoveBoard);
  };

  // for console testing, prints the entire board
  printBoard(){
  let printString = '';
    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++){
      for (let colIndex = 0; colIndex < this.columns; colIndex++){
        printString += String(this.board[rowIndex][colIndex].cellValue);
      }
      printString += '\n';
    }
    console.log(printString);
  };

  // getters
  get board(){
    return this._board;
  }


  get moves(){
    return this._moves;
  }
}

// Responsible for storing of each cell on the board
class Cell{
  _cellValue;
  _colorValue;
  _cellSymbol;

  constructor(){
    this._cellValue = '';
    this._colorValue = '';
    this._cellSymbol = '';
  }

  // Changing cell value once a player has clicked on that tile
  changeCellValue(playerValue){
    this._cellValue = playerValue;
    this._colorValue = playerValue === 1 ? "blue" : "red";
    this._cellSymbol = playerValue === 1 ? "X" : "O";
  };
  
  // Getters
  get cellValue(){
    return this._cellValue;
  };

  get colorValue(){
    return this._colorValue;
  }

  get cellSymbol(){
    return this._cellSymbol;
  }
}

// Acts as the back-end. Responsible for handling player moves, as well as checking for wins and stalemates
class gameController{

  playerOneName;
  playerTwoName;
  _activePlayer;
  _board;
  playerDB;

  
  // default parameters for naming in case the inputs for the name choosing remain blank
  constructor(playerOneName = "Player One", playerTwoName = "Player Two"){
    this.playerOneName = playerOneName;
    this.playerTwoName = playerTwoName;
    this._board = new Board();
    // default player info
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
    this._activePlayer = this.playerDB.playerOne;
  }

  // check if a row, column or diagonal consists of only one value (and that they are not blank)
  checkArrayForOneValue(check){
    let firstValue = check[0].cellValue;
    let testArray = check.filter(cellMate => cellMate.cellValue === firstValue);
    // because, all 3 values would be the same to each other 
    return testArray.length === 3 && firstValue !== '';
  };

  // function responsible for determining if a win has occured
  checkForWins(){
    const boardReplica = this._board.board;

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

  // Check if board is filled
  checkIfFilled(){
    const boardReplica = this._board.board;

    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
      for (let colIndex = 0; colIndex < 3; colIndex++){
        if (boardReplica[rowIndex][colIndex].cellValue === ''){
          return false;
        }
      }
    }
    return true;
  }

  // Function used to help switch turns between two players
  swapActivePlayers = () => {
    this._activePlayer = this._activePlayer === this.playerDB.playerOne ? this.playerDB.playerTwo : this.playerDB.playerOne;
  }

  // The board will have an eventlistener for each button, allowing it to pass row and col params
  actionOnBoard(row, column){
    // Prevents user from pressing after wins
    let validMove = this._board.changeCell(row, column, this._activePlayer.value);
    // check if valid move before allowing to move on
    if (validMove){
      const winCheck = this.checkForWins();
      const fillCheck = this.checkIfFilled();
      // check for win
      if (winCheck){
        const playerStatusRef = document.querySelector('.player-status');
        playerStatusRef.innerHTML = ``;
        const playerStatusRefHTML =
        `
        <p class = "${this._activePlayer.color}-player-status-text result-text">
        ${this._activePlayer.name} (${this._activePlayer.color}) won! 
        </p>
        `;
        playerStatusRef.innerHTML = playerStatusRefHTML;

        const boardRef = document.querySelector('.board');
        boardRef.innerHTML = ``;

        // resets game, sends player name meaning someone won
        this.reset(this._activePlayer);
      }
      // check for stalemate
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

        // resets game, sends null meaning stalemate
        this.reset(null);
      }
      // swap players if game is still in progress
      else{
        this.swapActivePlayers();
      }
    }
  };

  // reset game
  reset(gameResult){

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

    
    // allows player to reset and go back to username input
    const buttonResetRef = document.querySelector('.button-reset-aftermath');
    buttonResetRef.addEventListener('click', () => {
      buttonAftermathRef.remove();
      new userInput();
    });

    // stores the finished game
    new storeGame(this.playerDB.playerOne, this.playerDB.playerTwo, this._board.moves, gameResult);
  };


  // getters 
  
  get board(){
    return this._board.board;
  }

  get activePlayer(){
    return this._activePlayer;
  }
}

// Responsible for manipualting DOM and showing the game to the user (the front-end)
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

  // Rendering the body of the html so that the board and the game can appear
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
      Turn: <span class = "${this.game.activePlayer.color}-player-status-text">${this.game.activePlayer.name}</span>
    </p>
    `;
    playerStatusRef.innerHTML = playerStatusRefHTML;

    // Change the board
    const board = this.game.board;

    // Clear the board
    boardRef.innerHTML = ``;

    let boardHTML = ``;

    // Adding the grid and the cells for each of the 9 squares of the tic tac toe board
    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
      for (let colIndex = 0; colIndex < 3; colIndex++){
        boardHTML +=
        `
        <div class = "cell">
          <button class = "button-${rowIndex}-${colIndex}">
            <p class = "${board[rowIndex][colIndex].colorValue}-cell">
              ${board[rowIndex][colIndex].cellSymbol}
            </p>
          </button>
        </div>
        `;
      }
    }
    boardRef.innerHTML = boardHTML;

    // Allows user to add an action to the board, redirecting to a function
    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
      for (let colIndex = 0; colIndex < 3; colIndex++){
        this.addActionClick(rowIndex, colIndex, `button-${rowIndex}-${colIndex}`);
      }
    }
  }

  // Function communicates with backend when the user clicks the board through the adding of an event listener
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

// Starts the chain of userinput first
new userInput();