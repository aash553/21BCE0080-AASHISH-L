const socket = io();

let gameId = null;
let playerIndex = null;
let selectedPiece = null;
let currentBoard = null;

const createGameBtn = document.getElementById('createGame');
const joinGameBtn = document.getElementById('joinGame');
const gameIdInput = document.getElementById('gameIdInput');
const gameBoardDiv = document.getElementById('gameBoard');
const gameInfoDiv = document.getElementById('gameInfo');

createGameBtn.addEventListener('click', () => {
  socket.emit('createGame');
});

joinGameBtn.addEventListener('click', () => {
  const id = gameIdInput.value.trim();
  if (id) {
    socket.emit('joinGame', id);
  }
});

socket.on('gameCreated', (id) => {
  gameId = id;
  gameInfoDiv.textContent = `Game created with ID: ${gameId}. Waiting for opponent...`;
});

socket.on('gameJoined', (game) => {
  gameId = game.gameId;
  playerIndex = game.players.indexOf(socket.id);
  currentBoard = game.board;
  renderBoard(game.board);
  updateGameInfo(game);
});

socket.on('gameUpdate', (game) => {
  currentBoard = game.board;
  renderBoard(game.board);
  updateGameInfo(game);
});

socket.on('validMoves', (moves) => {
  console.log("Received valid moves:", moves);
  highlightValidMoves(moves);
});

socket.on('gameOver', (winningPlayer) => {
  gameInfoDiv.textContent = `Game Over! ${winningPlayer === playerIndex ? 'You win!' : 'You lose!'}`;
});

function renderBoard(board) {
  gameBoardDiv.innerHTML = '';
  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'cell';
      cellDiv.textContent = cell;
      cellDiv.dataset.x = x;
      cellDiv.dataset.y = y;
      cellDiv.addEventListener('click', () => handleCellClick(x, y));
      gameBoardDiv.appendChild(cellDiv);
    });
  });
}

function handleCellClick(x, y) {
  console.log("Cell clicked:", x, y);
  if (selectedPiece) {
    console.log("Attempting move from", selectedPiece, "to", [x, y]);
    socket.emit('move', { gameId, from: selectedPiece, to: [x, y] });
    clearHighlights();
    selectedPiece = null;
  } else {
    const clickedPiece = currentBoard[y][x];
    if (clickedPiece && clickedPiece.startsWith(playerIndex === 0 ? 'A' : 'B')) {
      console.log("Selecting piece:", clickedPiece);
      selectedPiece = [x, y];
      highlightSelectedPiece(x, y);
      socket.emit('requestValidMoves', { gameId, position: [x, y] });
    }
  }
}

function highlightSelectedPiece(x, y) {
  clearHighlights();
  const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  if (cell) cell.classList.add('selected');
}

function highlightValidMoves(moves) {
  moves.forEach(([x, y]) => {
    const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell) cell.classList.add('valid-move');
  });
}

function clearHighlights() {
  document.querySelectorAll('.selected, .valid-move').forEach(el => {
    el.classList.remove('selected', 'valid-move');
  });
}

function updateGameInfo(game) {
  const currentPlayerText = game.currentTurn === playerIndex ? 'Your' : "Opponent's";
  gameInfoDiv.textContent = `${currentPlayerText} turn`;
}

socket.on('error', (message) => {
  alert(message);
});