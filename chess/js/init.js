let board
let game = new Chess()
let statusEl = $('#status')
let fenEl = $('#fen')
let pgnEl = $('#pgn')

let getPositionalDelta = (moves) => {
  const symValues = {
    'Q': 0,
    'R': 0,
    'N': 0,
    'B': 0
  }

  // For each available square add 1/9 of a point until a max of 8/9 point is reached.
  // Max is not 1 because positional advantage won't confer to a pawn sac, for now
  for (let i = 0; i < moves.length; ++i) {
    let c = moves[i][0]
    if (symValues[c] < 0.7) {
      // if (c === 'R') symValues[c] += 1 / 20
      symValues[c] += 1 / 7
    }
  }

  return symValues['N'] + symValues['B'] + symValues['R']
}




// Given a fen string, returns the material between the black and white player.
let getMaterialDelta = (fen, color) => {
  let score = 0

  let i = 0
  while (fen[i] !== ' ') {
    let c = fen[i]
    if (c === 'p') score += 1
    else if (c === 'P') score -= 1
    else if (c === 'n') score += 3
    else if (c === 'N') score -= 3
    else if (c === 'b') score += 3
    else if (c === 'B') score -= 3
    else if (c === 'r') score += 5
    else if (c === 'R') score -= 5
    else if (c === 'q') score += 9
    else if (c === 'Q') score -= 9
    ++i
  }

  return score
}

const makeMove2 = function () {
  console.time('Decision Time')

    // Initilize current board
    const fen = buildValidFen(board, 'b')
    const symGame = new Chess(fen)
    const moves = symGame.moves()

    nodesVisited = 0

    let gameTree = buildGameTree(symGame, depth, -100)
    let bestMove = getLeastWorstMove(gameTree)

    console.log(nodesVisited)
    console.log('game tree: ', gameTree)

    game.move(bestMove.move)

    board.position(game.fen())
    updateStatus()
    console.timeEnd('Decision Time')
  }

let nodesVisited = 0

const buildGameTree = (symGame, depth, parentWorstDelta, move = '') => {
  let possibleMoves = symGame.moves()
  let allMoves = possibleMoves.slice()
  let fen = symGame.fen()

  nodesVisited += possibleMoves.length

  if (depth <= 1) { // Not root depth
    // possibleMoves = symGame.moves({square: move.slice(-2)})
    // console.log(move.slice(-2))
    console.log(possibleMoves)
    if (possibleMoves.length === 0 || depth === -1) { // maximum depth reached
      const delta = getMaterialDelta(fen) + getPositionalDelta(allMoves)

      return instantiateTree(fen, move, delta, null)
    }
  }

  const tree = {}
  let branchWorstDelta = 100

  for (let i = 0, len = possibleMoves.length; i < len; ++i) {
    let captureAvailable

    const currMove = possibleMoves[i]

    symGame.move(currMove)

    // If current move has a direct capture reaction, flag it.
    let reactionMoves
    if (depth <= 0) reactionMoves = symGame.moves({square: move.slice(-2)})
    else reactionMoves = symGame.moves()
    if (reactionMoves.join().indexOf('x') > -1) captureAvailable = true

    // If current move allows for an indirect capture reaction, flag it.
    let j = 0
    while (depth === 2 && !captureAvailable && j < reactionMoves.length) {
      let nextMove = reactionMoves[j]

      // Temporary work around because using {orientation: "w"} corrupts board.
      symGame.move(nextMove)
      symGame.move(symGame.moves()[0])

      reactionMovesRank2 = symGame.moves()
      nodesVisited += reactionMovesRank2.length

      if (reactionMovesRank2.join().indexOf('x') > -1) {
        captureAvailable = true
      }

      symGame.undo()
      symGame.undo()

      ++j
    }


    let currFen = symGame.fen()
    if (captureAvailable) {
      tree[currMove] = buildGameTree(symGame, depth - 1, parentWorstDelta, currMove)
    } else {
      const delta = getMaterialDelta(currFen) + getPositionalDelta(allMoves)

      tree[currMove] = instantiateTree(currFen, currMove, delta, null)
    }

    if (tree[currMove].delta < parentWorstDelta) {
      symGame.undo()
      return instantiateTree(currFen, currMove, tree[currMove].delta, tree)
    }

    if (tree[currMove].delta < branchWorstDelta) {
      branchWorstDelta = tree[currMove].delta
    }
    symGame.undo()
  }

  return instantiateTree(fen, move, branchWorstDelta, tree)
}

const instantiateTree = (fen, move, delta, responses) => {
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

var onDrop = function (source, target) {
  let currentBoard = game.fen()

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  window.setTimeout(makeMove, 75)

  updateStatus()
}

// do not pick up pieces if the game is over
// only pick up pieces for White
var onDragStart = function (source, piece, position, orientation) {
  if (game.in_checkmate() === true || game.in_draw() === true)
    return false
}

let buildValidFen = (board, turn) => {
  return board.fen() + ' ' + turn + ' KQkq - 0 1'
}

function shuffle (array) {
  var currentIndex = array.length, temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

var updateStatus = function () {
  var status = ''

  let moveColor
  if (game.turn() === 'b') {
    moveColor = 'Black'
  } else {
    moveColor = 'White'
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  statusEl.html(status)
  fenEl.html(game.fen())
  pgnEl.html(game.pgn())
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function () {
  board.position(game.fen())
}

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}

board = ChessBoard('board', cfg)

// if(Math.round(Math.random())) {
//   window.setTimeout(makeMove, 250)
// }

updateStatus()

function Node(fen) {
    this.game = new Chess(fen)
    this.value = () => {
      return getMaterialDelta(this.game.fen()) + getPositionalDelta(this.game.moves())
    }
    this.isTerminal = () => false
    this.children = () => {
      let children = []

      this.game.moves().forEach((move) => {
        this.game.move(move)

        children.push(new Node(this.game.fen()))

        this.game.undo()
      })

      return children
    }
}

const makeMove = () => {
  const fen = buildValidFen(board, 'b')
  let root = new Node(fen)

  console.time('Decision Time')
  let best = negaMax(root)
  console.log(best)
  console.timeEnd('Decision Time')
  console.log(nodesVisited)

  game = new Chess(best.node.game.fen())
  board.position(best.node.game.fen())

  updateStatus()
}

function negaMax (node, options) {
  let best = {node: null, score: -Infinity}
  let opts = options || {}
  let color = opts.color || -1
  let depth = opts.depth || 1

  // negamax algorithm taken from http://wikipedia.org/wiki/Negamax
  function getScore(node, depth, alpha, beta, color) {
    var bestValue = -Infinity;

    if (depth === 0 || node.isTerminal()) {
      nodesVisited++
      return color * node.value();
    }

    node.children().forEach((child) => {
      let value = -getScore(child, depth - 1, -beta, -alpha, -color);
      bestValue = Math.max(value, bestValue);
      let skip = Math.max(alpha, value) >= beta;
      if (skip) return false;
    });

    return bestValue;
  };

  // return node with highest score
  node.children().forEach((child) => {
    let score = color * getScore(child, depth, -Infinity, Infinity, color);
    if (score <= best.score) return;
    best.node = child;
    best.score = score;
  });

  return best;
};
