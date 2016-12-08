let board
let game = new Chess()
let statusEl = $('#status')
let fenEl = $('#fen')
let pgnEl = $('#pgn')

// Given a fen string, returns the material between the black and white player.
let getMaterialDelta = (fen) => {
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

const makeMove = function () {
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

// Applies every possible capture at position 'square'. Returns the optimal case scenario for each player.
const staticCaptureExchange = (symGame, square, color, move) => {
  let moves = symGame.moves().filter((move) => move.slice(-2) === square)
  nodesVisited += moves.length

  if (moves.length === 0) { // no more captures available
    return new Node(symGame.fen(), move, getMaterialDelta(symGame.fen()) * color * -1, null)
  }

  let responses = {}

  for (let i = 0, len = moves.length; i < len; ++i) {
    symGame.move(moves[i])
    responses[moves[i]] = staticCaptureExchange(symGame, square, color * -1, moves[i])
    symGame.undo()
  }

  let bestDelta = -Infinity

  $.each(responses, function(move, response) {
    if (response.delta > bestDelta) bestDelta = response.delta
  });

  return new Node(symGame.fen(), move, bestDelta, responses)
}

const buildGameTree = (symGame, depth, parentWorstDelta, move = '') => {

  if (depth === 0) { // terminal node
    return new Node(symGame.fen(), move, getMaterialDelta(symGame.fen()), null)
  }

  let moves = symGame.moves()
  let captureMoves = []
  let idleMoves = []
  nodesVisited += moves.length
  let fen = symGame.fen()
  const responses = {}
  let branchWorstDelta = 100

  moves.map((move) => {
    if (move.indexOf('x') === -1) idleMoves.push(move)
    else captureMoves.push(move)
  })

  // Evalute all capture sequences
  for (let i = 0, len = captureMoves.length; i < len; ++i) {
    let currMove = captureMoves[i]
    symGame.move(currMove)
    responses[currMove] = staticCaptureExchange(symGame, currMove.slice(-2), 1, currMove)

    if (responses[currMove].delta < parentWorstDelta) {
      symGame.undo()
      return new Node(symGame.fen(), move, responses[currMove].delta, responses)
    }

    if (responses[currMove].delta < branchWorstDelta) {
      branchWorstDelta = responses[currMove].delta
    }
    symGame.undo()
  }

  // Evaluate all positional sequences
  for (let i = 0, len = idleMoves.length; i < len; ++i) {
    let currMove = idleMoves[i]

    symGame.move()
    responses[currMove] = buildGameTree(symGame, depth - 1, parentWorstDelta, currMove)
    symGame.undo()
  }

  return new Node(symGame.fen(), move, branchWorstDelta, responses)
}

function Node (fen, move, delta, responses) {
  this.fen = fen
  this.move = move
  this.delta = delta
  this.responses = responses
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

const depth = 1

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

var updateStatus = function () {
  var status = ''

  let moveColor
  if (game.turn() === 'b') moveColor = 'Black'
  else moveColor = 'White'

  // checkmate?
  if (game.in_checkmate() === true) status = 'Game over, ' + moveColor + ' is in checkmate.'
  // draw?
  else if (game.in_draw() === true) status = 'Game over, drawn position'
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
updateStatus()
