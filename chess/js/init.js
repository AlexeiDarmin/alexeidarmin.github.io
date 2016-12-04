let board
let game = new Chess()
let statusEl = $('#status')
let fenEl = $('#fen')
let pgnEl = $('#pgn')


let getPositionalDelta = (moves) => {
  const symValues = {
    'Q' : 0,
    'R' : 0,
    'N' : 0,
    'B' : 0
  }

  // For each available square add 1/9 of a point until a max of 8/9 point is reached.
  // Max is not 1 because positional advantage won't confer to a pawn sac, for now
  for(let i = 0; i < moves.length; ++i) {
    let c = moves[i][0]
    if (symValues[c] < 0.9) {
      symValues[c] += 1/10
    }
  }

  return symValues['N'] + symValues['B']
}



// Given a fen string, returns the material between the black and white player.
let getMaterialDelta = (fen) => {
  let delta = 0

  let i = 0
  while (fen[i] !== ' ') {
    let c = fen[i]
    if      (c === 'p') delta += 1
    else if (c === 'P') delta -= 1
    else if (c === 'n') delta += 3
    else if (c === 'N') delta -= 3
    else if (c === 'b') delta += 3
    else if (c === 'B') delta -= 3
    else if (c === 'r') delta += 5
    else if (c === 'R') delta -= 5
    else if (c === 'q') delta += 9
    else if (c === 'Q') delta -= 9
    ++i
  }

  return delta
}

const makeMove = function() {
  console.time('Decision Time');
  runChessBotMove(); // run whatever needs to be timed in between the statements
  console.timeEnd('Decision Time');
};

const buildGameTree = (symGame, depth, parentWorstDelta, move = '') => {
  let possibleMoves = symGame.moves()
  let fen = symGame.fen()

  console.log('considering: ', possibleMoves)

  if (depth === 0) { // Terminal leaf node
    const currDelta = getMaterialDelta(fen) + getPositionalDelta(possibleMoves)

    return populateTree(fen, move, currDelta, null)
  }

  const moves = {}
  let branchWorstDelta = 100

  for (let i = 0; i < possibleMoves.length; ++i) {
    let captureAvailable = false

    const currMove = possibleMoves[i]

    symGame.move(currMove)

    // If current move has a direct capture reaction, flag it.
    let reactionMoves = symGame.moves()
    if (reactionMoves.join().indexOf('x') > -1) captureAvailable = true

    // If current move allows for an indirect capture reaction, flag it.
    let j = 0
    while (!captureAvailable && j < reactionMoves.length) {
      let nextMove = reactionMoves[j]
      console.log('before reaction: ', symGame.fen())
      symGame.move(nextMove)
      symGame.move(symGame.moves()[0])
      console.log('after reaction: ', symGame.fen())

      reactionMovesRank2 = symGame.moves()
      console.log('after reaction moves: ', reactionMovesRank2)

      if (reactionMovesRank2.join().indexOf('x') > -1) {
        captureAvailable = true
      }

      symGame.undo()
      symGame.undo()

      ++j
    }

    let currFen = symGame.fen()
    if (captureAvailable){
      moves[currMove] = buildGameTree(symGame, depth - 1, parentWorstDelta, currMove)
    } else {
      const delta = getMaterialDelta(currFen) + getPositionalDelta(currFen)
      if (delta < branchWorstDelta) branchWorstDelta = delta

      moves[currMove] = populateTree(currFen, currMove, delta, null)
    }

    if (moves[currMove].delta < parentWorstDelta){
      symGame.undo()
      return populateTree(currFen, currMove, moves[currMove].delta, moves)
    }

    if (moves[currMove].delta < branchWorstDelta) {
      branchWorstDelta = moves[currMove].delta
    }
    symGame.undo()

  }

  return populateTree(fen, move, branchWorstDelta, moves)
}

const populateTree = (fen, move, delta, responses) => {
  return {
    fen: fen,
    move: move,
    delta: delta,
    responses: responses
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

const depth = 2

let runChessBotMove = () => {

  // Initilize current board
  const fen = buildValidFen(board, 'b')
  const symGame = new Chess(fen)
  const moves = symGame.moves()

  let gameTree = buildGameTree(symGame, depth, -100)
  let bestMove = getLeastWorstMove(gameTree)

  console.log("game tree: ", gameTree)

  game.move(bestMove.move)

  board.position(game.fen());
  updateStatus();
}

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

  window.setTimeout(makeMove, 75);

  updateStatus();

};


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
