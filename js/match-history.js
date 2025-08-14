class Game{

  playerTwoInfo;
  playerTwoInfo;
  boardMoves;
  winner;

  constructor(playerOneInfo, playerTwoInfo, boardMoves, winner){
    this.playerOneInfo = playerOneInfo;
    this.playerTwoInfo = playerTwoInfo;
    this.boardMoves = boardMoves;
    this.winner = winner;
  }

  // Getters

  get playerOneSymbol(){
    return this.playerOneInfo.symbol;
  }

  get playerOneColor(){
    return this.playerOneInfo.color;
  }

  get playerOneName(){
    return this.playerOneInfo.name;
  }

  get playerTwoSymbol(){
    return this.playerTwoInfo.symbol;
  }

  get playerTwoColor(){
    return this.playerTwoInfo.color;
  }

  get playerTwoName(){
    return this.playerTwoInfo.name;
  }

  get boardMoves(){
    return this.boardMoves;
  }

  get winner(){
    return this.winner;
  }
}

class renderMatchHistory{
  constructor(){
    this.displayMatchHistory();
  }

  displayMatchHistory(){
    let containerRef = document.querySelector('.container');
    containerRef.classList.add('match-history-container');

    containerRef.innerHTML = ``;
    let containerRefInnerHTML = 
    `
    <div class = "match-history-title-container">
      <a href = "../index.html" class ="back-to-home-linker"><button class = "back-to-home">Back To Home</button></a>
      <div class = "match-history-title">
        Match History
      </div>
    </div>
    `;

    const gameStorageRef = JSON.parse(localStorage.getItem('allGames')) || [];
    let gameNumber = 1;

    for (const gameItem of gameStorageRef){
      const convertedGameItem = new Game(gameItem[0], gameItem[1], gameItem[2], gameItem[3]);
      containerRefInnerHTML += 
      `
      <div class = "game-info game-info-${gameNumber}">
        <div>
          Game #${gameNumber}
        </div>

        <div>
          <div>
            <span class = "${convertedGameItem.playerOneColor}-match-history"> ${convertedGameItem.playerOneName} (${convertedGameItem.playerOneColor}) (${convertedGameItem.playerOneSymbol}) </span> vs. <span class = "${convertedGameItem.playerTwoColor}-match-history"> ${convertedGameItem.playerTwoName} (${convertedGameItem.playerTwoColor}) (${convertedGameItem.playerTwoSymbol}) </span>
          </div>
        </div>

        <div>
          Result: <span class = "${!convertedGameItem.winner ? '' : (convertedGameItem.winner.name === convertedGameItem.playerOneName ? convertedGameItem.playerOneColor + "-match-history" : convertedGameItem.playerTwoColor + "-match-history")}"> ${convertedGameItem.winner ? convertedGameItem.winner.name + ' won' : 'Stalemate.'} </span>
        </div>

        <div>
          <button class = "game-info-review-button-${gameNumber} game-info-review-button">
            Review
          </button>
          <button class = "game-info-delete-button-${gameNumber} game-info-delete-button">
            Delete
          </button>
        </div>
      </div>
      `
      gameNumber += 1;
    };

    containerRef.innerHTML = containerRefInnerHTML;

    for (let i = 1; i <= gameStorageRef.length; i++){
      const deleteButtonRef = document.querySelector(`.game-info-delete-button-${i}`);
      const elementToDelete = document.querySelector(`.game-info-${i}`);
      deleteButtonRef.addEventListener('click', () => {
        elementToDelete.remove()
        gameStorageRef.splice(i - 1, 1);
        localStorage.setItem('allGames', JSON.stringify(gameStorageRef));
        new renderMatchHistory();
      });
    }


    for (let i = 1; i <= gameStorageRef.length; i++){
      const reviewButtonRef = document.querySelector(`.game-info-review-button-${i}`);
      reviewButtonRef.addEventListener('click', () => {
        containerRef.classList.remove('match-history-container');
        new renderSingleMatch(i)});
    }
  }
}

class renderSingleMatch{

  gameNumber;
  moveNumber;

  constructor(gameNumber, moveNumber = 0){
    this.gameNumber = gameNumber;
    this.moveNumber = moveNumber;
    this.displaySingleMatch();
  }

  displaySingleMatch(){
    const containerRef = document.querySelector('.container');
    containerRef.classList.add('game-container');

    const gameStorageRef = JSON.parse(localStorage.getItem('allGames'))[this.gameNumber - 1];
    const gameRecord = new Game(gameStorageRef[0], gameStorageRef[1], gameStorageRef[2], gameStorageRef[3]);
    const currentMove = gameRecord.boardMoves[this.moveNumber];


    containerRef.innerHTML = ``;

    containerRef.innerHTML = 
    `
      <div>
        <button class = "back">
          Back
        </button>
      </div>

      <div class = "game-match-info">
        <div>
          <span class = "${gameRecord.playerOneColor}-match"> ${gameRecord.playerOneName} (${gameRecord.playerOneColor}) (${gameRecord.playerOneSymbol}) </span> vs. <span class = "${gameRecord.playerTwoColor}-match"> ${gameRecord.playerTwoName} (${gameRecord.playerTwoColor}) (${gameRecord.playerTwoSymbol}) </span>
        </div>

        <div>
          <p>
            Move #: ${this.moveNumber}
          </p>
        </div>
      </div>

      <div class = "match-grid">
      </div>

      <div class = "buttons">
        ${this.moveNumber > 0 ?`
          <button class = "previous">
            Previous
          </button> 
        ` : ``
        }

        ${this.moveNumber < gameRecord.boardMoves.length - 1 ? `
        <button class = "next">
          Next
        </button>  
        ` : ``
        }
      </div>
    `
    ;

    const matchGridRef = document.querySelector('.match-grid');
    const nextButtonRef = document.querySelector('.next');
    const previousButtonRef = document.querySelector('.previous');
    const backButtonRef = document.querySelector('.back');

    if (this.moveNumber < gameRecord.boardMoves.length - 1){
      nextButtonRef.addEventListener('click', () => {
        if (this.moveNumber < gameRecord.boardMoves.length){
          new renderSingleMatch(this.gameNumber, this.moveNumber + 1);
        }
      })
    }

    if (this.moveNumber > 0){
        previousButtonRef.addEventListener('click', () => {
        if (this.moveNumber > 0){
          new renderSingleMatch(this.gameNumber, this.moveNumber - 1);
        }
      })
    }

    backButtonRef.addEventListener('click', () => {
      containerRef.classList.remove('game-container');
      new renderMatchHistory();
    });

    let matchGridRefInnerHTML = ``;

    for (let rowIndex = 0; rowIndex < 3; rowIndex++){
      for (let colIndex = 0; colIndex < 3; colIndex++){
        matchGridRefInnerHTML += 
        `
        <div class = "cell">
          <button class = "button-${rowIndex}-${colIndex}">
            <p class = "${currentMove[rowIndex][colIndex].colorValue}">
              ${currentMove[rowIndex][colIndex].cellSymbol}
            </p>
          </button>
        </div>
        `;        
      }
    }

    matchGridRef.innerHTML = matchGridRefInnerHTML;
  }
}

const renderMatchInstance = new renderMatchHistory();