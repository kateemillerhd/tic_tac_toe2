const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];
  
  const getBoard = () => board;
  
  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };
  
  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };
  
  return { getBoard, setMark, reset };
})();


const Player = (name, mark) => {
  return { name, mark };
};

const GameController = (() => {
  let player1, player2;
  let currentPlayer;
  let gameOver = false;
  
  const startGame = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X");
    player2 = Player(name2 || "Player 2", "O");
    currentPlayer = player1;
    Gameboard.reset();
    gameOver = false;
    DisplayController.render();
    DisplayController.setStatus(`${currentPlayer.name}'s turn`);
  };
  
  const restartGame = () => {
    if (!player1 || !player2) return;
    Gameboard.reset();
    gameOver = false;
    currentPlayer = player1;
    DisplayController.render();
    DisplayController.setStatus(`${currentPlayer.name}'s turn`);
  };
  
  const playRound = (index) => {
    if (gameOver) return;
    
    const success = Gameboard.setMark(index, currentPlayer.mark);
    if (!success) return;
    
    DisplayController.render();
    
    const winningCombo = checkWinner(Gameboard.getBoard(), currentPlayer.mark);
    if (winningCombo) {
      DisplayController.highlightWinner(winningCombo);
      DisplayController.setStatus(`${currentPlayer.name} wins!`);
      gameOver = true;
      return;
    }

    if (Gameboard.getBoard().every(cell => cell !== "")) {
      DisplayController.setStatus("It's a tie!");
      gameOver = true;
      return;
    }
    
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    DisplayController.setStatus(`${currentPlayer.name}'s turn`);
  };
  
  const checkWinner = (board, mark) => {
    const winningCombos = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (let combo of winningCombos) {
      if (combo.every(i => board[i] === mark)) {
        return combo;
      }
    }
    return null;
  };
    
  return { startGame, restartGame, playRound };
})();


const DisplayController = (() => {
  const boardContainer = document.getElementById("gameboard");
  const statusText = document.getElementById("status");
  
  const render = () => {
    boardContainer.innerHTML = "";
    Gameboard.getBoard().forEach((mark, index) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (mark !== "") cell.classList.add("taken");
      cell.textContent = mark;
      cell.addEventListener("click", () => GameController.playRound(index));
      boardContainer.appendChild(cell);
    });
  };
  
  const setStatus = (message) => {
    statusText.textContent = message;
  };
  
  const highlightWinner = (combo) => {
    const cells = document.querySelectorAll(".cell");
    combo.forEach(i => cells[i].classList.add("winner"));
  };
  
  document.getElementById("start-btn").addEventListener("click", () => {
    const name1 = document.getElementById("player1").value;
    const name2 = document.getElementById("player2").value;
    GameController.startGame(name1, name2);
  });
  
  document.getElementById("restart-btn").addEventListener("click", () => {
    GameController.restartGame();
  });
  
  return { render, setStatus, highlightWinner };
})();