let board
let game = new Chess()
let statusEl = $('#status')
let fenEl = $('#fen')
let pgnEl = $('#pgn')


// Given a fen string, returns the material value for both players as ints.
// [white, black]
let getMaterialValue = (fen) => {
  let values = {
    'Q' : 9,
    'R' : 5,
    'N' : 3,
    'B' : 3,
    'P' : 1
  }

  // BoardJS provides an invalid fen (lacking spaces)
  let distance = fen.length
  if (fen.indexOf(' ') >= 0) distance = fen.indexOf(' ')

  // Computes raw material value
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

let getPositionalValue = (fen) => {
  // Computes added 'potential' value
  // pieces that have many possible moves are more valuable
  let symGame = new Chess(fen)
  let moves = symGame.moves()
  let symValues = {
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

let buildGameTree = (fen, depth) => {
  let symGame = new Chess(fen)
  let possibleMoves = shuffle(symGame.moves())
  let turn
  if (fen.indexOf(' b ') >= 0) {
    turn = 'b'
  } else {
    turn = 'w'
  }

  if (possibleMoves.length === 0) return;

  let moves = {}


  for (let i = 0; i < possibleMoves.length; ++i) {
    moves[possibleMoves[i]] = getMoveResults(possibleMoves[i], fen)
    if (depth > 0) {
      let nextFen = moves[possibleMoves[i]]['fen']
      moves[possibleMoves[i]].responses = buildGameTree(nextFen, depth - 1)
    }
  }

  return moves
}

let getWorstCase = (gameTree, rootMove = true) => {
  let responses
  if (gameTree['responses']) {
    responses = gameTree['responses']
  } else if (!gameTree['material']){
    responses = gameTree
  }

  // Base case, final child leafs of tree
  if (!responses && gameTree['material']) {
    return gameTree['material']['black'] - gameTree['material']['white']
  }

  let deltas = []

  // For each possible response
  for (let move in responses) {
    // Collect worst case for this response
    if (responses.hasOwnProperty(move)) {
        let delta = getWorstCase(responses[move], false)
        // console.log(delta)

        // Multiple types of returns have to be handled, this unifies data types
        if (delta['delta'] !== undefined) {
          deltas.push({
            delta: delta['delta'],
            move: move
          })
        } else {
          deltas.push({
            delta: delta,
            move: move
          })
        }
    }
  }
  // console.log(deltas)
  // return Math.min.apply(null, deltas)

  // For all children return the lowest possible deltas
  // For root node return the highest (meaning the highest minimum)
  if (rootMove) {
    return deltas.reduce(function(d1, d2) {
        return d1.delta > d2.delta ? d1 : d2;
      })
  } else {
    return deltas.reduce(function(d1, d2) {
        return d1.delta < d2.delta ? d1 : d2;
      })
  }
}

var makeMove = function() {
  let fen = buildValidFen(board, 'b')
  let gameTree = buildGameTree(fen, 2)

  console.log(gameTree)
  // console.log(gameTree)
  // console.log("worst case: ", getWorstCase(gameTree))
  // for (let key in moves) {
  //    if (moves.hasOwnProperty(key)) {
  //      let parent = key
  //      let variations = moves[key]['responses']
  //      while (moves[key]['responses']) {
  //
  //      }
  //    }
  // }
  //

  // want to find the best worst-case scenario
  // let worstCaseMoves = {};
  // for (let key in counterMoves) {
  //   if (counterMoves.hasOwnProperty(key)) {
  //     let bestCounterMove = ''
  //     let worstDelta = 100
  //
  //     for (let i = 0; i < counterMoves[key].length; ++i){
  //       let blackMaterial = counterMoves[key][i]['material']['black']
  //       let blackPositional = getPositionalValue(counterMoves[key][i]['fen'])
  //       let whiteMaterial = counterMoves[key][i]['material']['white']
  //       let whitePositional = getPositionalValue(dictMoves[key]['fen'])
  //
  //       let delta = blackMaterial + blackPositional - whiteMaterial - whitePositional
  //
  //       if (delta <= worstDelta){
  //         worstDelta = delta
  //         bestCounterMove = key
  //       }
  //     }
  //
  //     worstCaseMoves[key] = worstDelta
  //   }
  // }
  //
  // console.log('worst: ', worstCaseMoves)
  // let bestMove = ''
  // let leastWorstCaseDelta = -Infinity
  // for (let key in worstCaseMoves) {
  //   if (counterMoves.hasOwnProperty(key)) {
  //     if (worstCaseMoves[key] > leastWorstCaseDelta){
  //       leastWorstCaseDelta = worstCaseMoves[key]
  //       bestMove = key
  //     }
  //   }
  // }

  game.move(getWorstCase(gameTree)['move']);
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
