// import * from 'standard.js'


// Given a fen string, returns the material value for both players as ints.
// [white, black]
let getMaterialValue = (fen) => {
  // console.log(fen)
  let values = {
    'Q' : 9,
    'R' : 5,
    'N' : 3,
    'B' : 3,
    'P' : 1
  }

  let distance = fen.length
  if (fen.indexOf(' ') >= 0) distance = fen.indexOf(' ')


  let whiteValue = 0
  let blackValue = 0
  for(let i = 0; i < distance; ++i) {
    let c = fen[i].toUpperCase()
    if (['Q', 'R', 'N', 'B', 'P'].indexOf(c) >= 0){
      if (fen[i] === c){
        whiteValue += values[c]
      } else {
        blackValue += values[c]
      }
    }
  }

  return {
    'white' : whiteValue,
    'black' : blackValue
  }
}


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

let buildValidFen = (board) => {
  return board.fen() + ' ' + game.turn() + ' KQkq - 0 1'
}

var makeRandomMove = function() {
  var possibleMoves = game.moves();
  // console.log("possible moves:", possibleMoves)
  // game over
  if (possibleMoves.length === 0) return;

  let moves = []

  for (let i = 0; i < possibleMoves.length; ++i){
    // initializes virtual board with same position
    let tempBoard = new Chess(buildValidFen(board));

    // makes the current move and change position accordingly
    tempBoard.move(possibleMoves[i])

    console.log(tempBoard.fen())
    // retrieves resulting material values for each player
    moves.push([getMaterialValue(tempBoard.fen()), tempBoard.fen()])
  }

  let optimalMove = possibleMoves[0]
  let optimalValue = 40
  for (let i = 1; i < moves.length; ++i){
    if (moves[i][0].white < optimalValue){
      optimalValue = moves[i][0].white
      optimalMove = possibleMoves[i]
    }
  }

  console.log(optimalMove, optimalValue)


  console.log('moves:', moves)
  // if (history[game.fen()]){
  //   console.log('known')
  //   game.move(history[game.fen()])
  // } else {
  console.log('unkown')
  // var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(optimalMove);
  // }
  board.position(game.fen());
  updateStatus();

  console.log('fen: ', game.fen())
  console.log('material value: ', getMaterialValue(game.fen()))

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

// if(Math.round(Math.random())) {
//   window.setTimeout(makeRandomMove, 250);
// }

updateStatus();
