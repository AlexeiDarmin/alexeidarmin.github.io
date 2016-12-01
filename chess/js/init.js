let board
let game = new Chess()
let statusEl = $('#status')
let fenEl = $('#fen')
let pgnEl = $('#pgn')


// Given a fen string, returns the material value for both players as ints.
// [white, black]
let getMaterialValue = (fen) => {
  const values = {
    'Q' : 9,
    'R' : 5,
    'N' : 3,
    'B' : 3,
    'P' : 1
  }

  const distance = fen.indexOf(' ')

  // Computes raw material value
  const playerValues = {
    white: 0,
    black: 0
  }
  for(let i = 0; i < distance; ++i) {
    const c = fen[i].toUpperCase()
    if (['Q', 'R', 'N', 'B', 'P'].indexOf(c) >= 0){
      if (fen[i] === c){
        playerValues.white += values[c]
      } else {
        playerValues.black += values[c]
      }
    }
  }

  return playerValues
}

let getPositionalValue = (fen) => {
  // Computes added 'potential' value
  // pieces that have many possible moves are more valuable
  const symGame = new Chess(fen)
  const moves = symGame.moves()
  const symValues = {
    'Q' : 0,
    'R' : 0,
    'N' : 0,
    'B' : 0
  }

  // console.log('symMoves: ', moves)

  // For each available square add 1/9 of a point until a max of 8/9 point is reached.
  // Max is not 1 because positional advantage won't confer to a pawn sac, for now
  for(let i = 0; i < moves.length; ++i) {
    let c = moves[i][0]
    if (symValues[c] < 1) {
      symValues[c] += 1/8
    }
  }

  return symValues['N'] + symValues['B']
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
  console.time('mover');
  runChessBotMove(); // run whatever needs to be timed in between the statements
  console.timeEnd('mover');
};

let buildGameTree = (symGame, depth, worstDelta, move = '') => {
  const possibleMoves = symGame.moves()
  const fen = symGame.fen()

  if (depth === 0) {
    // Calculate material delta
    const material = getMaterialValue(fen)

    return {
      fen: fen,
      delta: material.black - material.white,
      move: move,
      responses: null
    }
  }

  const moves = {}
  let currWorstDelta = 100

  for (let i = 0; i < possibleMoves.length; ++i) {
    const currMove = possibleMoves[i]
    symGame.move(currMove)
    moves[currMove] = buildGameTree(symGame, depth - 1, worstDelta, currMove)
    symGame.undo()

    // If a branch of decisions leads to a worse delta than
    // in another branch, then stop building tree down this branch.
    if (moves[currMove].delta < worstDelta) {
      return {
        fen: symGame.fen(),
        move: currMove,
        delta: moves[currMove].delta,
        responses: moves
      }
    }
    if (moves[currMove].delta < currWorstDelta) currWorstDelta = moves[currMove].delta
  }

  return {
    fen: fen,
    move: move,
    delta: currWorstDelta,
    responses: moves
  }
}

let getLeastWorstMove = (gameTree) => {

    let optimalDecision = {
      delta: -100
    }

    for (var key in gameTree.responses) {
      if (gameTree.responses.hasOwnProperty(key)) {
        if (gameTree.responses[key].delta > optimalDecision.delta) {
          optimalDecision = gameTree.responses[key]
        }
      }
    }

    return optimalDecision
}

let runChessBotMove = () => {

  // Initilize current board
  const fen = buildValidFen(board, 'b')
  const symGame = new Chess(fen)
  const moves = symGame.moves()
  const depth = 2

  let gameTree = buildGameTree(symGame, depth, -100)
  console.log('after all: ', gameTree)
  let bestMove = getLeastWorstMove(gameTree)

  game.move(bestMove.move)

  board.position(game.fen());
  updateStatus();
}

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

  window.setTimeout(makeMove, 75);

  updateStatus();

};

var updateStatus = function() {
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
