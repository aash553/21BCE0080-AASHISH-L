const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const games = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  // Create a new game
  socket.on('createGame', () => {
    const gameId = Math.random().toString(36).substring(7);
    games[gameId] = {
      board: createInitialBoard(),
      players: [socket.id],
      currentTurn: 0
    };
    socket.join(gameId);
    socket.emit('gameCreated', gameId);
  });

  // Join an existing game
  socket.on('joinGame', (gameId) => {
    if (games[gameId] && games[gameId].players.length < 2) {
      games[gameId].players.push(socket.id);
      socket.join(gameId);
      io.to(gameId).emit('gameStarted', games[gameId]);
    } else {
      socket.emit('error', 'Game not found or already full');
    }
  });

  // Request valid moves for a character
  socket.on('requestValidMoves', ({ gameId, position }) => {
    const game = games[gameId];
    if (game) {
      const validMoves = getValidMoves(game.board, position, game.players.indexOf(socket.id));
      socket.emit('validMoves', validMoves);
    }
  });

  // Make a move
  socket.on('move', ({ gameId, from, to }) => {
    const game = games[gameId];
    if (game && game.players[game.currentTurn] === socket.id) {
      const [fromX, fromY] = from;
      const [toX, toY] = to;
      const piece = game.board[fromY][fromX];

      if (isValidMove(game.board, from, to, game.players.indexOf(socket.id))) {
        // Execute move
        game.board[toY][toX] = piece;
        game.board[fromY][fromX] = '';

        // Switch turn
        game.currentTurn = 1 - game.currentTurn;
        io.to(gameId).emit('gameUpdate', game);

        // Check for win condition
        if (checkWinCondition(game.board)) {
          io.to(gameId).emit('gameOver', 1 - game.currentTurn);
        }
      } else {
        socket.emit('error', 'Invalid move');
      }
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
    for (let gameId in games) {
      const game = games[gameId];
      game.players = game.players.filter(player => player !== socket.id);
      if (game.players.length === 0) {
        delete games[gameId];
      }
    }
  });
});

// Create initial board setup
function createInitialBoard() {
  return [
    ['A-P1', 'A-P2', 'A-H1', 'A-H2', 'A-P3'],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['B-P1', 'B-P2', 'B-H1', 'B-H2', 'B-P3']
  ];
}

// Validate a move
function isValidMove(board, from, to, playerIndex) {
  const [fromX, fromY] = from;
  const [toX, toY] = to;
  const piece = board[fromY][fromX];

  if (!piece || piece[0] !== (playerIndex === 0 ? 'A' : 'B')) return false;
  if (toX < 0 || toX > 4 || toY < 0 || toY > 4) return false;

  const dx = toX - fromX;
  const dy = toY - fromY;

  if (piece.includes('P')) { // Pawn
    return Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && (dx !== 0 || dy !== 0);
  } else if (piece.includes('H1')) { // Hero1
    return (Math.abs(dx) === 2 && dy === 0) || (Math.abs(dy) === 2 && dx === 0);
  } else if (piece.includes('H2')) { // Hero2
    return Math.abs(dx) === Math.abs(dy) && Math.abs(dx) === 2;
  }

  return false;
}

function getValidMoves(board, from, playerIndex) {
  const [x, y] = from;
  const piece = board[y][x];
  const validMoves = [];

  if (!piece || piece[0] !== (playerIndex === 0 ? 'A' : 'B')) {
    return validMoves;
  }

  for (let toY = 0; toY < 5; toY++) {
    for (let toX = 0; toX < 5; toX++) {
      if (isValidMove(board, [x, y], [toX, toY], playerIndex)) {
        validMoves.push([toX, toY]);
      }
    }
  }

  return validMoves;
}

// Check for win condition
function checkWinCondition(board) {
  let aCount = 0, bCount = 0;
  for (let row of board) {
    for (let cell of row) {
      if (cell.startsWith('A')) aCount++;
      if (cell.startsWith('B')) bCount++;
    }
  }
  return aCount === 0 || bCount === 0;
}

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
