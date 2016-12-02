let board
let game = new Chess()
let statusEl = $('#status')
let fenEl = $('#fen')
let pgnEl = $('#pgn')
let transpositionTable = {}

let runNewChessBot = () => {
  // Initilize current board
  const fen = buildValidFen(board, 'b')
  const symGame = new Chess(fen)
  const moves = symGame.moves()

  let gameTree = buildGameTree(symGame, depth, -100)
  console.log(MTDF(gameTree, 2, 2))
}

/*
  MTD(f) Implementation inspired by : https://people.csail.mit.edu/plaat/mtdf.html#abmem
  inputs:
    root: node_type,
    f   : integer,
    d   : integer
  output: integer
*/
let MTDF = (root, f, d) => {
  let g = f
  let upperBound = Infinity
  let lowerBound = -Infinity

  while (lowerBound < upperBound) {
    let b = Math.max(g, lowerBound + 1)
    g = AlphaBetaWithMemory(root, b - 1, b, d)
    if (g < b) upperBound = g
    else lowerBound = g
  }
  return g
}

let AlphaBetaWithMemory = (n, alpha, beta, d) => {
  /* Transposition table lookup */
  if (transpositionTable(n.fen())) {
    if (n.lowerbound >= beta) return n.lowerbound
    if (n.upperbound <= alpha) return n.upperbound

    alpha = Math.max(alpha, n.lowerbound)
    beta = Math.min(beta, n.upperbound)
  }

  let g
  if (d === 0) g = getMaterialDelta(n.fen()) /* leaf node */
  else if (n === MAXNODE) {
    g = -INFINITY
    let a = alpha // save original alpha value
    let c = firstchild(n)

    while ((g < beta) && (c != NOCHILD)) {
      g = Math.max(g, AlphaBetaWithMemory(c, a, beta, d - 1))
      a = Math.max(a, g)
      c = nextbrother(c)
    }
  } else {/* n is a MINNODE */
    g = INFINITY
    let b = beta // save original beta value
    let c = firstchild(n)
    while ((g > alpha) && (c != NOCHILD)) {
      g = Math.min(g, AlphaBetaWithMemory(c, alpha, b, d - 1))
      b = Math.min(b, g)
      c = nextbrother(c)
    }
  }
  /* Traditional transposition table storing of bounds */
  /* Fail low result implies an upper bound */
  if (g <= alpha) {
    n.upperbound = g
    transpositionTable(n.fen()) = {
      upperbound: n.upperbound
    }
  }
  /* Found an accurate minimax value - will not occur if called with zero window */
  if ((g > alpha) && (g < beta)){
    n.lowerbound = g
    n.upperbound = g
    transpositionTable(n.fen()) = {
      lowerbound: n.lowerbound,
      upperbound: n.upperbound
    }
  }
  /* Fail high result implies a lower bound */
  if (g >= beta) {
    n.lowerbound = g
    transpositionTable(n.fen()) = {
      lowerbound: n.lowerbound
    }
  }
  return g
}


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
    if (symValues[c] < 1) {
      symValues[c] += 1/8
    }
  }

  return symValues['N'] + symValues['B'] + symValues['R']
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

var makeMove = function() {
  console.time('mover');
  runChessBotMove(); // run whatever needs to be timed in between the statements
  // runNewChessBot();
  console.timeEnd('mover');
};

let buildGameTree = (symGame, depth, worstDelta, move = '') => {

  let possibleMoves = symGame.moves()
  let fen = symGame.fen()
  let materialValue = getMaterialDelta(symGame.fen()) + getPositionalDelta(possibleMoves)

  if (depth <= 0 && depth !== -3){
    let remainingMoves = []
    possibleMoves.map((str) => {
      if (str.indexOf('x') >= 0) {
        remainingMoves.push(str)
      }
    })
    console.log('before/after: ', possibleMoves, remainingMoves )
    possibleMoves = remainingMoves
  }
  if (depth === -3 || possibleMoves.length === 0 || materialValue < 0) { // Terminal leaf node
    return {
      fen: symGame.fen(),
      delta: materialValue,
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

  result = {
    fen: fen,
    move: move,
    delta: currWorstDelta,
    responses: moves
  }

  return result
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
  console.log('after all: ', gameTree)
  let bestMove = getLeastWorstMove(gameTree)

  console.log("transp table: ", transpositionTable)
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
