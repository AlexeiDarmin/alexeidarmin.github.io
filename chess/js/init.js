var board,
  game = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn');

// do not pick up pieces if the game is over
// only pick up pieces for White
var onDragStart = function(source, piece, position, orientation) {
  if (game.in_checkmate() === true || game.in_draw() === true)
    return false
};

var makeRandomMove = function() {
  var possibleMoves = game.moves();
  console.log(possibleMoves)
  // game over
  if (possibleMoves.length === 0) return;

  if (history[game.fen()]){
    console.log('known')
    game.move(history[game.fen()])
  } else {
    console.log('unkown')
    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]);
  }
  board.position(game.fen());
  updateStatus();

};

let history = JSON.parse(localStorage.getItem('history')) || {};
// history = {};
localStorage.setItem('history', JSON.stringify(history));

var onDrop = function(source, target) {
  let currentBoard = game.fen();

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  history[currentBoard] = move;
  localStorage.setItem('history', JSON.stringify(history));

  console.log(history);

  window.setTimeout(makeRandomMove, 250);

  updateStatus();

};

var updateStatus = function() {
  // console.log(JSON.parse(localStorage.getItem('history')))
  // console.log(game.history())
  var status = '';

  let moveColor
  if (game.turn() === 'b') {
    moveColor = 'Black';
  } else {
    moveColor = 'White'
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }

  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};

board = ChessBoard('board', cfg);

if(Math.round(Math.random())) {
  window.setTimeout(makeRandomMove, 250);
}

updateStatus();
