var board,
  game = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn');


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

// do not pick up pieces if the game is over
// only pick up pieces for White
var onDragStart = function(source, piece, position, orientation) {
  if (game.in_checkmate() === true || game.in_draw() === true)
    return false
};

let buildValidFen = (board, turn) => {
  return board.fen() + ' ' + turn + ' KQkq - 0 1'
}

// simulates applying move 'move' to board 'simBoard'
let getMoveResults = (move, fen) => {
  let symGame = new Chess(fen);
  symGame.move(move)

  return {
    material: getMaterialValue(symGame.fen()),
    fen: symGame.fen(),
    move: move
  }
}

let findOptimalMove = (moves, possibleMoves) => {
  // Initialize a random move as the default optimal move
  let randomIndex = Math.floor(Math.random() * possibleMoves.length);
  let optimalMove = possibleMoves[randomIndex]
  let optimalValue = 40

  let turnColor = 'white'
  if (game.turn === 'b') turnColor = 'black'
  for (let i = 1; i < moves.length; ++i){
    if (moves[i]['material'][turnColor] < optimalValue){
      optimalValue = moves[i].material[turnColor]
      optimalMove = possibleMoves[i]
    }
  }

  console.log(optimalMove)

  return {
    move: optimalMove,
    value: optimalValue
  }
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var makeMove = function() {
  let possibleMoves = shuffle(game.moves())

  // game over
  if (possibleMoves.length === 0) return;

  // if (history[game.fen()]){
  //   console.log('known')
  //   game.move(history[game.fen()])
  // } else {

  let moves = []

  for (let i = 0; i < possibleMoves.length; ++i) {
    moves.push(getMoveResults(possibleMoves[i], buildValidFen(board, 'b')))
  }

  console.log("moves: ", moves)

  let counterMoves = {}
  for (let i = 0; i < moves.length; ++i){
    let symGame = new Chess(moves[i].fen)
    let simMoves = symGame.moves()

    for (let j = 0; j < simMoves.length; ++j){
      if (!counterMoves[moves[i].move]) {
        counterMoves[moves[i].move] = []
      }
      counterMoves[moves[i].move].push(getMoveResults(simMoves[j], moves[i].fen))
    }
  }

  // want to find the best worst-case scenario
  let worstCaseMoves = {};
  for (let key in counterMoves) {
    if (counterMoves.hasOwnProperty(key)) {
      let bestCounterMove = ''
      let worstDelta = 0

      for (let i = 0; i < counterMoves[key].length; ++i){
        let delta = counterMoves[key][i]['material']['black'] - counterMoves[key][i]['material']['white']

        if (delta <= worstDelta){
          worstDelta = delta
          bestCounterMove = key
        }
      }

      worstCaseMoves[key] = worstDelta
    }
  }

  let bestMove = ''
  let leastWorstCaseDelta = -Infinity
  for (let key in worstCaseMoves) {
    if (counterMoves.hasOwnProperty(key)) {
      if (worstCaseMoves[key] > leastWorstCaseDelta){
        leastWorstCaseDelta = worstCaseMoves[key]
        bestMove = key
      }
    }
  }


  console.log('worst: ', worstCaseMoves)
  // console.log("counterMoves: ", counterMoves)
  // console.log("optMove then optDelta: ", Move, wors)

  game.move(bestMove);
  // }
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

  window.setTimeout(makeMove, 250);

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
//   window.setTimeout(makeMove, 250);
// }

updateStatus();
