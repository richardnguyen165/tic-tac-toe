function Game(playerOneInfo, playerTwoInfo, boardMoves, winner){

  // Getters
  const getplayerOneInfoSymbol = () => playerOneInfo.symbol;
  const getplayerOneInfoColor = () => playerOneInfo.color;
  const getplayerOneInfoName = () => playerOneInfo.name;

  const getplayerTwoInfoSymbol = () => playerTwoInfo.symbol;
  const getplayerTwoInfoColor = () => playerTwoInfo.color;
  const getplayerTwoInfoName = () => playerTwoInfo.name;

  const getBoardMoves = () => boardMoves;

  const getWinner = () => winner;

  return {getBoardMoves, getplayerOneInfoSymbol, getplayerOneInfoColor, getplayerOneInfoName, getplayerTwoInfoSymbol, getplayerTwoInfoColor, getplayerTwoInfoName, getBoardMoves, getWinner}
}

function renderMatchHistory(){
  let containerRef = document.querySelector('.container');
  containerRef.classList.add('match-history-container');

  containerRef.innerHTML = ``;
  containerRefInnerHTML = 
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
    const convertedGameItem = Game(gameItem[0], gameItem[1], gameItem[2], gameItem[3]);
    containerRefInnerHTML += 
    `
    <div class = "game-info game-info-${gameNumber}">
      <div>
        Game #${gameNumber}
      </div>

      <div>
        <div>
          <span class = "${convertedGameItem.getplayerOneInfoColor()}-match-history"> ${convertedGameItem.getplayerOneInfoName()} (${convertedGameItem.getplayerOneInfoColor()}) (${convertedGameItem.getplayerOneInfoSymbol()}) </span> vs. <span class = "${convertedGameItem.getplayerTwoInfoColor()}-match-history"> ${convertedGameItem.getplayerTwoInfoName()} (${convertedGameItem.getplayerTwoInfoColor()}) (${convertedGameItem.getplayerTwoInfoSymbol()}) </span>
        </div>
      </div>

      <div>
        Result: <span class = "${!convertedGameItem.getWinner() ? '' : (convertedGameItem.getWinner().name === convertedGameItem.getplayerOneInfoName() ? convertedGameItem.getplayerOneInfoColor() + "-match-history" : convertedGameItem.getplayerTwoInfoColor() + "-match-history")}"> ${convertedGameItem.getWinner() ? convertedGameItem.getWinner().name + ' won' : 'Stalemate.'} </span>
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
      renderMatchHistory();
    });
  }


  for (let i = 1; i <= gameStorageRef.length; i++){
    const reviewButtonRef = document.querySelector(`.game-info-review-button-${i}`);
    reviewButtonRef.addEventListener('click', () => {
      containerRef.classList.remove('match-history-container');
      renderSingleMatch(i)});
  }
}

function renderSingleMatch(gameNumber, moveNumber = 0){
  const containerRef = document.querySelector('.container');
  containerRef.classList.add('game-container');

  const gameStorageRef = JSON.parse(localStorage.getItem('allGames'))[gameNumber - 1];
  const gameRecord = Game(gameStorageRef[0], gameStorageRef[1], gameStorageRef[2], gameStorageRef[3]);
  const currentMove = gameRecord.getBoardMoves()[moveNumber];


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
        <span class = "${gameRecord.getplayerOneInfoColor()}-match"> ${gameRecord.getplayerOneInfoName()} (${gameRecord.getplayerOneInfoColor()}) (${gameRecord.getplayerOneInfoSymbol()}) </span> vs. <span class = "${gameRecord.getplayerTwoInfoColor()}-match"> ${gameRecord.getplayerTwoInfoName()} (${gameRecord.getplayerTwoInfoColor()}) (${gameRecord.getplayerTwoInfoSymbol()}) </span>
      </div>

      <div>
        <p>
          Move #: ${moveNumber}
        </p>
      </div>
    </div>

    <div class = "match-grid">
    </div>

    <div class = "buttons">
      ${moveNumber > 0 ?`
        <button class = "previous">
          Previous
        </button> 
      ` : ``
      }

      ${moveNumber < gameRecord.getBoardMoves().length - 1 ? `
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

  if (moveNumber < gameRecord.getBoardMoves().length - 1){
    nextButtonRef.addEventListener('click', () => {
      if (moveNumber < gameRecord.getBoardMoves().length){
        renderSingleMatch(gameNumber, moveNumber + 1);
      }
    })
  }

  if (moveNumber > 0){
      previousButtonRef.addEventListener('click', () => {
      if (moveNumber > 0){
        renderSingleMatch(gameNumber, moveNumber - 1);
      }
    })
  }

  backButtonRef.addEventListener('click', () => {
    containerRef.classList.remove('game-container');
    renderMatchHistory()
  });

  matchGridRefInnerHTML = ``;

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

renderMatchHistory();