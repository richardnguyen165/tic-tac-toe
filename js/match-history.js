function renderMatchHistory(){
  containerRef.innerHTML = ``;
  const containerRef = document.querySelector('.container');

  containerRefInnerHTML = 
  `
  <div>
    <a href = "../index.html"><button class ="back-to-home">Back To Home</button></a>
  </div>
  `;

  const gameStorageRef = JSON.parse(localStorage.getItem('allGames'));
  let gameNumber = 1;

  for (const gameItem of gameStorageRef){
    containerRefInnerHTML += 
    `
    <div class = "game-info game-info-${gameNumber}">
      <div>
        Game #${gameNumber}
      </div>

      <div>
        Players:
        <div>
          ${gameItem.getplayerOneInfoName()} (${gameItem.getplayerOneInfoColor()}) vs. ${gameItem.getplayerTwoInfoName()} (${gameItem.getplayerTwoInfoColor()})
        </div>
      </div>

      <div>
        Result: ${gameItem.getWinner() ? getWinner.getWinner() + ' won' : 'Stalemate.'}
      </div>

      <div>
        <button class = "game-info-review-button-${gameNumber}">
          Review
        </button>
        <button class = "game-info-delete-button-${gameNumber}">
          Delete
        </button>
      </div>
    </div>
    `
    gameNumber += 1;
  };

  containerRef.innerHTML = containerRefInnerHTML;

  for (let i = 1; i < gameNumber; i++){
    const deleteButtonRef = document.querySelector(`.game-info-delete-button-${gameNumber}`);
    const elementToDelete = document.querySelector(`.game-info-${gameNumber}`);
    deleteButtonRef.addEventListener('click', () => elementToDelete.remove());
    gameStorageRef.splice(i - 1, 1);
    localStorage.setItem('allGames', JSON.stringify(gameStorageRef));
    renderMatchHistory();
  }


  for (let i = 1; i < gameNumber; i++){
    const reviewButtonRef = document.querySelector(`.game-info-review-button-${gameNumber}`);
    reviewButtonRef.addEventListener('click', () => renderSingleMatch(gameNumber));
  }
}

function renderSingleMatch(gameNumber, moveNumber = 1){
  containerRef = ``;

  containerRef.innerHTML = 
  `
    <div class = "match-grid">
    </div>

    <div class = "buttons>
      ${moveNumber > 1 ? `
      <button class = "next">
        Next
      </button>  
      ` : ``
      }

      ${moveNumber < gameRecord.length() ?`
        <button class = "previous">
          Previous
        </button> 
      ` : ``
      }
    </div>
  `
  ;

  const gameStorageRef = JSON.parse(localStorage.getItem('allGames'));
  const gameRecord = gameStorageRef[gameNumber - 1];
  const currentMove = gameRecord.getBoardMoves()[moveNumber];

  const matchGridRef = document.querySelector('.match-grid');

  const nextButtonRef = document.querySelector('.next');
  const previousButtonRef = document.querySelector('.previous');

  nextButtonRef.addEventListener('click', () => {
    if (moveNumber < gameRecord.length()){
      renderSingleMatch(gameNumber, moveNumber + 1);
    }
  })

  previousButtonRef.addEventListener('click', () => {
    if (moveNumber > 1){
      renderSingleMatch(gameNumber, moveNumber - 1);
    }
  })

  matchGridRefInnerHTML = ``;

  for (let rowIndex = 0; rowIndex < 3; rowIndex++){
    for (let colIndex = 0; colIndex < 3; colIndex++){
      matchGridRefInnerHTML += 
      `
      <div class = "cell">
        <button class = "button-${rowIndex}-${colIndex}">
          <p class = "${currentMove[rowIndex][colIndex].getColorValue()}">
            ${currentMove[rowIndex][colIndex].getCellSymbol()}
          </p>
        </button>
      </div>
      `;        
    }
  }

  matchGridRef.innerHTML = matchGridRefInnerHTML;
}

renderMatchHistory();