import { displayController } from "./game.js";

function userInput(){
  const connectInput = () => {
    const playerOneInputRef = document.querySelector('.player-one-input');
    const playerTwoInputRef = document.querySelector('.player-two-input');
    const playButtonRef = document.querySelector('.play');

    playButtonRef.addEventListener('click', () => {
      if (!playerOneInputRef.value){
        alert('Enter Player One Name!');
      }
      else if (!playerTwoInputRef.value){
        alert('Enter Player Two Name!');
      }
      else{
        displayController(playerOneInputRef.value, playerTwoInputRef.value);
        window.location.href = "../html/game.html";
      }
    });
  }
  connectInput();
}

userInput();
