console.log("=== Activity 10: Tic-Tac-Toe with localStorage ===");

// ===== PART A: localStorage DEMO =====
console.log("\n=== LOCALSTORAGE DEMO ===");

localStorage.setItem("demo", "Hello!");
console.log(localStorage.getItem("demo"));

const obj = { player: "X", score: 5 };
localStorage.setItem("obj", JSON.stringify(obj));
console.log(JSON.parse(localStorage.getItem("obj")));

localStorage.removeItem("demo");
localStorage.removeItem("obj");

// ===== PART B: GAME STATE =====

const STORAGE_KEY = "tictactoe-game";

let gameState = {
  board: ["", "", "", "", "", "", "", "", ""],
  currentPlayer: "X",
  gameActive: true,
  winner: null,
  winningCombination: null
};

const WINNING_COMBINATIONS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ===== GAME FUNCTIONS =====

function initializeGame() {
  gameState = {
    board: ["", "", "", "", "", "", "", "", ""],
    currentPlayer: "X",
    gameActive: true,
    winner: null,
    winningCombination: null
  };

  updateBoard();
  updateStatus();
  saveGameState();
}

function makeMove(index) {
  if (!gameState.gameActive || gameState.board[index] !== "") return;

  gameState.board[index] = gameState.currentPlayer;

  const result = checkWinner();

  if (result.winner) {
    gameState.gameActive = false;
    gameState.winner = result.winner;
    gameState.winningCombination = result.combination;
  } else if (gameState.board.every(c => c !== "")) {
    gameState.gameActive = false;
  } else {
    gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
  }

  updateBoard();
  updateStatus();
  saveGameState();
}

function checkWinner() {
  for (let combo of WINNING_COMBINATIONS) {
    const [a,b,c] = combo;

    if (
      gameState.board[a] &&
      gameState.board[a] === gameState.board[b] &&
      gameState.board[a] === gameState.board[c]
    ) {
      return { winner: gameState.board[a], combination: combo };
    }
  }
  return { winner: null, combination: null };
}

// ===== PART C: LOCAL STORAGE =====

function saveGameState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
}

function loadGameState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    gameState = JSON.parse(saved);
    return true;
  }
  return false;
}

// ===== PART D: UI =====

function updateBoard() {
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell, index) => {
    const value = gameState.board[index];

    cell.textContent = value;
    cell.classList.remove("taken", "x", "o", "winning");

    if (value) {
      cell.classList.add("taken");
      cell.classList.add(value.toLowerCase());
    }

    if (gameState.winningCombination?.includes(index)) {
      cell.classList.add("winning");
    }
  });
}

function updateStatus() {
  const status = document.getElementById("statusMessage");

  if (gameState.winner) {
    status.textContent = `Player ${gameState.winner} wins!`;
  } else if (!gameState.gameActive) {
    status.textContent = "Draw!";
  } else {
    status.textContent = `Player ${gameState.currentPlayer}'s turn`;
  }
}

// ===== EVENTS =====

function handleClick(e) {
  const index = e.target.getAttribute("data-index");
  if (index !== null) makeMove(parseInt(index));
}

// ===== INIT =====

function initializeApp() {
  const loaded = loadGameState();

  if (!loaded) {
    initializeGame();
  } else {
    updateBoard();
    updateStatus();
  }

  document.getElementById("gameBoard").addEventListener("click", handleClick);
  document.getElementById("newGameBtn").addEventListener("click", initializeGame);
}

initializeApp();