const PLAYER_ONE = "player_one";
const PLAYER_TWO = "player_two";
const EMPTY = "player_none";

const PLAYERS = { EMPTY, PLAYER_ONE, PLAYER_TWO };

const GAME_STATE = {
  PLAYER_ONE,
  PLAYER_TWO,
  DRAW: 0,
  ONGOING: -1
};
const GLOBAL = {
  boardState: initializeBoardState(),
  nextPlayerTurn: PLAYERS.PLAYER_ONE
};

function buildBoard() {
  const boardContainer = document.getElementById("boardContainer");

  if (boardContainer.childNodes.length > 1) {
    for (let i = 41; i >= 0; i--) {
      boardContainer.removeChild(boardContainer.childNodes[i]); // Remove <ul>'s first child node (index 0)
    }
  }

  for (let i = 0; i < 42; i++) {
    const cellElement = document.createElement("DIV");
    cellElement.classList.add("cell");
    cellElement.classList.remove(PLAYERS.PLAYER_ONE);
    cellElement.classList.remove(PLAYERS.PLAYER_TWO);

    cellElement.addEventListener("click", function() {
      const column = i % 7;
      const moveMade = makeMove(GLOBAL.boardState, column);

      // save snapshot of move to localStorage
      // if (trackingBestMove) {
      //   saveToTrainer.moveMade = column;

      //   commitToTrainer(saveToTrainer);
      //   trackingBestMove = false;
      // }
      // makeBotMove();
    });

    boardContainer.appendChild(cellElement);
  }
}

buildBoard();

function initializeBoardState() {
  const boardState = [];
  for (let i = 0; i < 42; i++) {
    boardState.push(PLAYERS.EMPTY);
  }
  return boardState;
}

function togglePlayerTurn() {
  GLOBAL.nextPlayerTurn =
    GLOBAL.nextPlayerTurn === PLAYERS.PLAYER_ONE
      ? PLAYERS.PLAYER_TWO
      : PLAYERS.PLAYER_ONE;
}

function makeMove(boardState, column) {
  let gameState = getGameState(boardState);
  if (gameState !== GAME_STATE.ONGOING) {
    console.log("game ended, player won: ", gameState);
    return;
  }

  const index = findIndexOfLowestRow(boardState, column);
  if (index > -1) {
    boardState[index] = GLOBAL.nextPlayerTurn;
    togglePlayerTurn();
    updateDOM(boardState, index);
  }

  gameState = getGameState(boardState);
  if (gameState !== GAME_STATE.ONGOING) {
    console.log("game ended, player won: ", gameState);
    return index;
  }

  return index;
}

// Returns the index of lowest empty row at the specific column, -1 if no available empty cells.
function findIndexOfLowestRow(boardState, column) {
  for (let r = 5; r >= 0; r--) {
    if (boardState[r * 7 + column] === PLAYERS.EMPTY) {
      return r * 7 + column;
    }
  }
  return -1;
}

function updateDOM(boardState, index) {
  const cellElement = document.getElementsByClassName("cell")[index];
  cellElement.classList.add(boardState[index]);
}

/*
 Returns the ID of the winning player if the game is won.
 Returns 0 if the game is a draw.
 Returns -1 if the game is ongoing
*/
function getGameState(boardState) {
  // Check rows for a win
  for (let r = 0; r <= 5; r++) {
    for (let c = 0; c < 4; c++) {
      const i = r * 7 + c;
      const isWinning = isWinningSlice(boardState.slice(i, i + 4));
      if (isWinning !== false) return isWinning;
    }
  }

  // Check columns
  for (let c = 0; c < 7; c++) {
    for (let r = 0; r <= 2; r++) {
      const boardSlice = [
        boardState[r * 7 + c],
        boardState[(r + 1) * 7 + c],
        boardState[(r + 2) * 7 + c],
        boardState[(r + 3) * 7 + c]
      ];
      const isWinning = isWinningSlice(boardSlice);
      if (isWinning !== false) return isWinning;
    }
  }

  // Check diagonals for a win
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++) {
      // Checks left diagonal
      if (c < 4) {
        const boardSlice = [
          boardState[r * 7 + c],
          boardState[(r + 1) * 7 + c + 1],
          boardState[(r + 2) * 7 + c + 2],
          boardState[(r + 3) * 7 + c + 3]
        ];
        const isWinning = isWinningSlice(boardSlice);
        if (isWinning !== false) return isWinning;
      }

      // Checks right diagonal
      if (c >= 3) {
        const boardSlice = [
          boardState[r * 7 + c],
          boardState[(r + 1) * 7 + c - 1],
          boardState[(r + 2) * 7 + c - 2],
          boardState[(r + 3) * 7 + c - 3]
        ];
        const isWinning = isWinningSlice(boardSlice);
        if (isWinning !== false) return isWinning;
      }
    }
  }

  if (boardState.some(val => val === PLAYERS.EMPTY)) {
    return GAME_STATE.ONGOING;
  }

  return GAME_STATE.DRAW;
}

function countWinningStates(boardState, player) {
  let wins = 0;
  // Check rows for a win
  for (let r = 0; r <= 5; r++) {
    for (let c = 0; c < 4; c++) {
      const i = r * 7 + c;
      const isWinning = isWinningSliceForPlayer(
        boardState.slice(i, i + 4),
        player
      );
      if (isWinning !== false) wins++;
    }
  }

  // Check columns
  for (let c = 0; c < 7; c++) {
    for (let r = 0; r <= 2; r++) {
      const boardSlice = [
        boardState[r * 7 + c],
        boardState[(r + 1) * 7 + c],
        boardState[(r + 2) * 7 + c],
        boardState[(r + 3) * 7 + c]
      ];
      const isWinning = isWinningSliceForPlayer(boardSlice, player);
      if (isWinning !== false) wins++;
    }
  }

  // Check diagonals for a win
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++) {
      // Checks left diagonal
      if (c < 4) {
        const boardSlice = [
          boardState[r * 7 + c],
          boardState[(r + 1) * 7 + c + 1],
          boardState[(r + 2) * 7 + c + 2],
          boardState[(r + 3) * 7 + c + 3]
        ];
        const isWinning = isWinningSliceForPlayer(boardSlice, player);
        if (isWinning !== false) wins++;
      }

      // Checks right diagonal
      if (c > 3) {
        const boardSlice = [
          boardState[r * 7 + c],
          boardState[(r + 1) * 7 + c - 1],
          boardState[(r + 2) * 7 + c - 2],
          boardState[(r + 3) * 7 + c - 3]
        ];
        const isWinning = isWinningSliceForPlayer(boardSlice, player);
        if (isWinning !== false) wins++;
      }
    }
  }

  return wins;
}

// Takes 4 cells and returns the winning player's ID if they all match that one player.
// Returns false otherwise.
function isWinningSlice(miniBoard) {
  if (miniBoard.some(p => p === PLAYERS.EMPTY)) {
    return false;
  }
  if (
    miniBoard[0] === miniBoard[1] &&
    miniBoard[1] === miniBoard[2] &&
    miniBoard[2] === miniBoard[3]
  ) {
    return miniBoard[0];
  }

  return false;
}

function isWinningSliceForPlayer(miniBoard, player) {
  if (miniBoard.some(p => p === PLAYERS.EMPTY)) {
    return false;
  }
  if (
    miniBoard[0] === player &&
    miniBoard[0] === miniBoard[1] &&
    miniBoard[1] === miniBoard[2] &&
    miniBoard[2] === miniBoard[3]
  ) {
    return miniBoard[0];
  }

  return false;
}

function isPotentialWinningSlice(miniBoard, player) {
  const opponent = togglePlayerTurnLocal(player);
  if (miniBoard.some(p => p === opponent)) {
    return 0;
  }
  if (miniBoard.some(p => p === player)) {
    if (miniBoard.every(p => p === player)) {
      return Infinity;
    }
    let winningStrength = 0;
    miniBoard.map(p => (p === player ? (winningStrength += 0.25) : null));
    return winningStrength;
  }

  return 0;
}

// Hacky random moves below

// setInterval(makeRandomMove, 100);

function makeBotMove() {
  const idealMove = runBot(GLOBAL.boardState, GLOBAL.nextPlayerTurn);
  console.log("ideal move:", idealMove);
  makeMove(GLOBAL.boardState, idealMove % 7);
}

function runBot(boardState, nextPlayerTurn) {
  /* base cases */
  // First move
  if (boardState[38] === PLAYERS.EMPTY) {
    return 38;
  }

  // Second move
  if (boardState.filter(p => p === PLAYERS.EMPTY).length === 41) {
    return 39;
  }

  // check if bot has a winning move, make it
  let move = findWinningMoveIndexForplayer(boardState, nextPlayerTurn);
  if (move !== -1) {
    return move;
  }
  // check if opponent has a winning move, block it
  const opponentTurn = togglePlayerTurnLocal(nextPlayerTurn);
  move = findWinningMoveIndexForplayer(boardState, opponentTurn);
  if (move !== -1) {
    return move;
  }

  // console.log("Checking to play a forced win!");
  // Checks potential to force win next turn
  move = checkForForcedMultipleWinningScenarios(boardState, nextPlayerTurn);
  if (move !== -1) {
    return move;
  }

  // console.log("collect move vetoes");
  // Checks for forced win moves at two level depths, if they exist, veto them from consideration for the rest of the alg.
  // const vetoMoves = deepForcedMultipleWinningScenarioVetosList(
  //   boardState,
  //   nextPlayerTurn
  // );
  let vetoMoves = getMovesThatResultInALoss(boardState, nextPlayerTurn);
  console.log('veto moves', vetoMoves)
  let vetoMoves2 = deepForcedMultipleWinningScenarioVetosList(boardState, nextPlayerTurn)
  vetoMoves = vetoMoves.concat(vetoMoves2)

  // console.log("Checking to block a forced loss");

  // Checks for opponent potential to force win next turn, block it
  move = checkForForcedMultipleWinningScenarios(
    boardState,
    opponentTurn,
    vetoMoves
  );
  if (move !== -1) {
    return move;
  }

  // console.log("STRAT 1");
  // Executes custom strategy # 1
  move = multiColumnStrategy(boardState, nextPlayerTurn);
  if (move !== -1) {
    return move;
  }

  // console.log("STRAT 2");
  // Executes custom strategy # 2
  move = forcedPlayStrategy(boardState, nextPlayerTurn, vetoMoves);
  if (move !== -1) {
    return move;
  }

  // console.log("GENERIC");
  /* Generic positional play */
  move = runAdvancedBot(boardState, nextPlayerTurn, vetoMoves);

  if (move !== -1) {
    return move
  }

  // Game is lost, pick any move
  move = getFirstValidMove(boardState, nextPlayerTurn)
  return move;
}

function getFirstValidMove(boardState, player) {
  for (let c = 0; c < 7; c++) {
    const index = findIndexOfLowestRow(boardState, c);
    if (index !== -1) {
      return c
    }
  }
  return null
}



function getMovesThatResultInALoss(boardState, player) {
  const vetoMoves = [];
  debugger
  const opponent = togglePlayerTurnLocal(player);
  for (let c = 0; c < 7; c++) {
    const index = findIndexOfLowestRow(boardState, c);
    if (index !== -1) {
      let newBoard = boardState.slice();
      newBoard[index] = player;
      const winningOpponentMove = findWinningMoveIndexForplayer(
        newBoard,
        opponent
      );
      if (winningOpponentMove > -1) {
        vetoMoves.push(c);
      }
    }
  }
  return vetoMoves;
}

let testBoard = [
  EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
  EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
  EMPTY,EMPTY,EMPTY,PLAYER_ONE,EMPTY,EMPTY,EMPTY,
  EMPTY,EMPTY,EMPTY,PLAYER_TWO,PLAYER_TWO,EMPTY,EMPTY,
  EMPTY,PLAYER_ONE,EMPTY,PLAYER_TWO,PLAYER_ONE,EMPTY,EMPTY,
  PLAYER_ONE,PLAYER_ONE,PLAYER_TWO,PLAYER_ONE,PLAYER_TWO,EMPTY,EMPTY,
]

console.log('testboard length', testBoard.length, getMovesThatResultInALoss(testBoard, PLAYER_TWO))

// If a player move, can be countered by an opponent move, that triggers a forced win, then veto the player move from consideration.
function deepForcedMultipleWinningScenarioVetosList(boardState, player) {
  const vetoMoves = [];
  const opponent = togglePlayerTurnLocal(player);
  
  for (let c = 0; c < 7; c++) {
    const index = findIndexOfLowestRow(boardState, c);
    if (index !== -1) {
      let newBoard = boardState.slice();
      newBoard[index] = player;

      const move = checkForForcedMultipleWinningScenarios(newBoard, opponent);
      if (move > -1) {
        vetoMoves.push(c);
      }
    }
  }

  return vetoMoves;
}

/*
 Checks if there is a move that the opponent can make, that forces the current player to block a win,
 but then introduces another winning position for the opponent. If so, block this move.
*/
function forcedPlayStrategy(boardState, player, vetoMoves) {
  const opponent = togglePlayerTurnLocal(player);
  for (let c = 0; c < 7; c++) {
    if (!vetoMoves.includes(c)) {
      const index = findIndexOfLowestRow(boardState, c);
      if (index !== -1) {
        let newBoard = boardState.slice();
        newBoard[index] = player;

        // Do not consider this branch of moves if we just let the opponent win.
        const opponentWinningMove = findWinningMoveIndexForplayer(
          newBoard,
          opponent
        );
        if (opponentWinningMove === -1) {
          // Searching for opponent move that triggers a forced move by us.
          for (let c2 = 0; c2 < 7; c2++) {
            const index2 = findIndexOfLowestRow(newBoard, c2);
            if (index2 > -1) {
              let newerBoard = newBoard.slice();
              newerBoard[index2] = opponent;

              let winningMove1 = findWinningMoveIndexForplayer(
                newerBoard,
                opponent
              );
              if (winningMove1 > -1) {
                let newestBoard = newerBoard.slice();
                newestBoard[
                  findIndexOfLowestRow(newestBoard, winningMove1)
                ] = player;

                let winningMove2 = findWinningMoveIndexForplayer(
                  newestBoard,
                  opponent
                );

                // Forced win found! block it.
                // && condition to handle a bug where this case bypasses the move veto
                if (winningMove2 > -1 && !vetoMoves.includes(c2)) {
                  return c2;
                }
              }
            }
          }
        }
      }
    }
  }
  return -1;
}

// If only two columns in play, plays above the opponent's piece
function multiColumnStrategy(boardState, player) {
  const colsUsedIsTwo = onlyTwoColumns(boardState);
  if (!colsUsedIsTwo) {
    return -1;
  } else {
    const opponent = togglePlayerTurnLocal(player);
    let largestIndex = 0;
    let col = -1;
    for (let c = 0; c < 7; c++) {
      const index = findIndexOfLowestRow(boardState, c);
      if (index !== -1) {
        if (boardState[index + 7] === opponent && index > largestIndex) {
          largestIndex = index;
          col = c;
        }
      }
    }
    return col;
  }
}

// Returns true if only two columns are being used
function onlyTwoColumns(boardState) {
  let colUsed = 0;
  for (let c = 0; c < 7; c++) {
    if (boardState[c + 7 * 5] !== PLAYERS.EMPTY) {
      colUsed++;
      if (colUsed > 2) {
        return false;
      }
    }
  }
  return true;
}

function checkForForcedMultipleWinningScenarios(boardState, player, vetoMoves = []) {
  const opponent = togglePlayerTurnLocal(player);

  for (let col = 0; col < 7; col++) {
    if (!vetoMoves.includes(col)) {
      const index = findIndexOfLowestRow(boardState, col);
      const newBoard = boardState.slice();
      if (index !== -1) {
        newBoard[index] = player;

        // Confirms opponent cannot win from previous move.
        let opponentCanWin = false;
        for (let col2 = 0; col2 < 7; col2++) {
          const newestBoard = newBoard.slice();
          const index2 = findIndexOfLowestRow(newestBoard, col2);
          if (index2 !== -1) {
            newestBoard[index2] = opponent;

            const gameState = getGameState(newestBoard);

            if (gameState === opponent) opponentCanWin = true;
          }
        }

        let wins = 0;
        // If the original player's move, does not introduce a winning move for the opponent at col2, search for forced win
        if (!opponentCanWin) {
          for (let col2 = 0; col2 < 7; col2++) {
            const newestBoard = newBoard.slice();
            const index2 = findIndexOfLowestRow(newestBoard, col2);
            if (index2 !== -1) {
              newestBoard[index2] = player;
              const gameState = getGameState(newestBoard);
              if (gameState === player) {
                wins++;

                // Force win game found
                if (wins === 2) {
                  return col;
                }
              }
            }
          }
        }
      }
    }
  }
  return -1;
}

function runAdvancedBot(boardState, playerTurn, vetoMoves) {
  let bestMove = null;
  let bestMoveDelta = -Infinity;

  let movesDict = {};
  for (let col = 0; col < 7; col++) {
    if (!vetoMoves.includes(col)) {
      const newBoard = boardState.slice();
      const index = findIndexOfLowestRow(newBoard, col);
      newBoard[index] = playerTurn;

      // const basePlayerPossibleWins = getTotalPotentialWins(boardState, playerTurn)
      let bestOpponentPossibleWinsResponse = Infinity;
      let opponent = togglePlayerTurnLocal(playerTurn);
      let newestBoard = null;

      for (let col2 = 0; col2 < 7; col2++) {
        // Finds best move in response to our suggested move, and assumes the opponent makes the best move.
        const newerBoard = newBoard.slice();
        const index2 = findIndexOfLowestRow(newerBoard, col2);
        newerBoard[index2] = opponent;

        // If this move for opponent produces the highest delta
        const possiblePlayerWins = getTotalPotentialWins(
          newerBoard,
          playerTurn
        );
        const possibleOpponentWins = getTotalPotentialWins(
          newerBoard,
          opponent
        );
        const delta = possiblePlayerWins - possibleOpponentWins;

        if (delta < bestOpponentPossibleWinsResponse) {
          bestOpponentPossibleWinsResponse = delta;
          newestBoard = newerBoard;
        }
      }
      movesDict[col] = {
        delta: bestOpponentPossibleWinsResponse
      };
      if (bestOpponentPossibleWinsResponse > bestMoveDelta && index !== -1) {
        bestMoveDelta = bestOpponentPossibleWinsResponse;
        bestMove = col;
      }
    }
  }

  return bestMove;
}

var myList = [1, 2, 3];

function myFun() {
  const foundNum = myList.find(val => {
    if (val === 2) {
      return 2;
    }
  });
}

function getTotalPotentialWins(boardState, player) {
  let possibleWins = 0;

  possibleWins += getTotalPotentialRowWins(boardState, player);
  possibleWins += getTotalPotentialColWins(boardState, player);
  possibleWins += getTotalPotentialDiagWins(boardState, player);

  return possibleWins;
}

function getTotalPotentialRowWins(boardState, player) {
  let possibleWins = 0;

  for (let r = 0; r <= 5; r++) {
    for (let c = 0; c < 4; c++) {
      const i = r * 7 + c;
      const winningStrength = isPotentialWinningSlice(
        boardState.slice(i, i + 4),
        player
      );
      if (winningStrength >= 1) {
        return Infinity;
      }
      possibleWins += winningStrength;
    }
  }
  return possibleWins;
}

function getTotalPotentialColWins(boardState, player) {
  let possibleWins = 0;
  for (let c = 0; c < 7; c++) {
    for (let r = 0; r <= 2; r++) {
      const boardSlice = [
        boardState[r * 7 + c],
        boardState[(r + 1) * 7 + c],
        boardState[(r + 2) * 7 + c],
        boardState[(r + 3) * 7 + c]
      ];
      const winningStrength = isPotentialWinningSlice(boardSlice, player);
      if (winningStrength >= 1) {
        return Infinity;
      }
      possibleWins += winningStrength;
    }
  }
  return possibleWins;
}

function getTotalPotentialDiagWins(boardState, player) {
  let possibleWins = 0;

  // Check diagonals for a win
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++) {
      // Checks left diagonal
      if (c < 4) {
        const boardSlice = [
          boardState[r * 7 + c],
          boardState[(r + 1) * 7 + c + 1],
          boardState[(r + 2) * 7 + c + 2],
          boardState[(r + 3) * 7 + c + 3]
        ];
        const winningStrength = isPotentialWinningSlice(boardSlice, player);
        if (winningStrength >= 1) {
          return Infinity;
        }
        possibleWins += winningStrength;
      }

      // Checks right diagonal
      if (c > 3) {
        const boardSlice = [
          boardState[r * 7 + c],
          boardState[(r + 1) * 7 + c - 1],
          boardState[(r + 2) * 7 + c - 2],
          boardState[(r + 3) * 7 + c - 3]
        ];
        const winningStrength = isPotentialWinningSlice(boardSlice, player);
        if (winningStrength >= 1) {
          return Infinity;
        }
        possibleWins += winningStrength;
      }
    }
  }

  return possibleWins;
}

// returns the index of the winning move if there is one, negative one otherwise
function findWinningMoveIndexForplayer(boardState, nextPlayerTurn) {
  for (let col = 0; col < 7; col++) {
    const index = findIndexOfLowestRow(boardState, col);

    const newBoard = boardState.slice();
    newBoard[index] = nextPlayerTurn;
    const winningState = getGameState(newBoard);
    if (winningState !== GAME_STATE.ONGOING) {
      return col;
    }
  }
  return -1;
}

function togglePlayerTurnLocal(nextPlayerTurn) {
  return nextPlayerTurn === PLAYERS.PLAYER_ONE
    ? PLAYERS.PLAYER_TWO
    : PLAYERS.PLAYER_ONE;
}

// function makeBotMove(neuralNetwork) {
//   const neurons = applyGameStateToNeuralNetwork(
//     neuralNetwork,
//     GLOBAL.boardState,
//     GLOBAL.nextPlayerTurn
//   );

//   let max = indexOfMax(neurons.map(n => n.value));
//   // const column = getRandomInteger(0, 7);
//   const column = max;
//   makeMove(GLOBAL.boardState, column);
// }

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

/*
  Neural network code
*/

// Creates a layer of neurons
function createNeuralLayer(length) {
  const neurons = [];
  for (let i = 0; i < length; i++) {
    neurons.push(createNeuron());
  }
  return neurons;
}

function createNeuron() {
  return {
    value: 0,
    childrenSynapse: []
  };
}

// Creates synapsis between layers of neurons
function linkSynapsis(neuralNetwork) {
  for (let i = 1; i < neuralNetwork.length; i++) {
    const parentLayer = neuralNetwork[i - 1];
    const currentLayer = neuralNetwork[i];
    for (
      let parent_index = 0;
      parent_index < parentLayer.length;
      parent_index++
    ) {
      for (
        let child_index = 0;
        child_index < currentLayer.length;
        child_index++
      ) {
        const parentNeuron = parentLayer[parent_index];
        const childNeuron = currentLayer[child_index];
        createSynapse(parentNeuron, childNeuron);
      }
    }
  }
  return neuralNetwork;
}

function createSynapse(neuronOne, neuronTwo) {
  neuronOne.childrenSynapse.push(getRandom(0, 1));
}

// A neural network is a list of neural layers.
function createNeuralNetwork() {
  const inputLayerOne = createNeuralLayer(126);
  const hiddenLayerOne = createNeuralLayer(126);
  const outputLayer = createNeuralLayer(8);

  const neuralNetwork = linkSynapsis([
    inputLayerOne,
    hiddenLayerOne,
    outputLayer
  ]);

  return neuralNetwork;
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Updates the values of each input node with the relevant values from the game state
function applyGameStateToNeuralNetwork(neuralNetwork, board, playerTurn) {
  applyBoardLayer(neuralNetwork[0], board);

  sumLayers(neuralNetwork[0], neuralNetwork[1]);

  // hidden layers
  resetLayer(neuralNetwork[1]);
  sumLayers(neuralNetwork[0], neuralNetwork[1]);

  resetLayer(neuralNetwork[2]);
  sumLayers(neuralNetwork[1], neuralNetwork[2]);

  return neuralNetwork[2];
}

// Evaluates the output layer based on the other neural layers and synapses.
function sumLayers(parentLayer, childLayer) {
  for (let i = 0; i < childLayer.length; i++) {
    const childNeuron = childLayer[i];
    let sum = 0;
    // calculate the sum of influence of the parent synapsis on current value
    for (let p = 0; p < parentLayer.length; p++) {
      sum += parentLayer[p].value * parentLayer[p].childrenSynapse[i];
    }
    const influence = sum / parentLayer.length;
    childNeuron.value += sigmoid(influence);
  }
}

// Resets the values at the given layer
function resetLayer(layer) {
  for (let i = 0; i < layer.length; i++) {
    layer[i].value = 0;
  }
}

function applyPlayerLayer(layer, player) {
  layer[0].value = player === PLAYERS.PLAYER_ONE ? 1 : 0;
  layer[1].value = player === PLAYERS.PLAYER_ONE ? 0 : 1;
}

function applyBoardLayer(layer, board) {
  // Empty cells
  for (let i = 0; i < board.length; i++) {
    if (board[i] === PLAYERS.EMPTY) {
      layer[i].value = 1;
    } else {
      layer[i].value = 0;
    }
  }

  // Player one owned cells
  for (let i = 0; i < board.length; i++) {
    if (board[i] === PLAYERS.PLAYER_ONE) {
      layer[i + (board.length - 1)].value = 1;
    } else {
      layer[i + (board.length - 1)].value = 0;
    }
  }

  // Player two owned cells
  for (let i = 0; i < board.length; i++) {
    if (board[i] === PLAYERS.PLAYER_ONE) {
      layer[i + (board.length - 1) * 2].value = 1;
    } else {
      layer[i + (board.length - 1) * 2].value = 0;
    }
  }
}

let saveToTrainer = {
  global: null,
  moveMade: null
};

let trackingBestMove = false;

// Once clicked, stores the current gameState and listens for the expected move.
// Saves the gamestate and the expected ideal move to localstorage trainer
function activateTrainerTracker() {
  saveToTrainer.global = {
    boardState: GLOBAL.boardState.slice(),
    nextPlayerTurn: GLOBAL.nextPlayerTurn
  };
  trackingBestMove = true;
}

function commitToTrainer() {
  let trainingData =
    JSON.parse(window.localStorage.getItem("trainingData")) || [];
  trainingData.push(saveToTrainer);

  if (trainingData.length > 20) {
    trainingData = trainingData.slice(1, trainingData.length);
  }
  window.localStorage.setItem("trainingData", JSON.stringify(trainingData));
}

// suppose bot = PLAYERS.PLAYER_ONE
// be able to evaluate game state in respect to if the bot is player one or two.

const rnn = createNeuralNetwork();

if (!JSON.parse(window.localStorage.getItem("connectFourNeuralNetwork"))) {
  saveNeuralNetworkToLocalStorage(rnn);
}

function saveNeuralNetworkToLocalStorage(neuralNetwork) {
  const rnn = JSON.stringify(neuralNetwork);

  window.localStorage.setItem("connectFourNeuralNetwork", rnn);
}

let bestNeuralNetwork = JSON.parse(
  window.localStorage.getItem("connectFourNeuralNetwork")
);
// let bestNeuralNetwork = rnn

// console.log(bestNeuralNetwork);

// console.log(
//   "training data: ",
//   JSON.parse(window.localStorage.getItem("trainingData"))
// );

// evolve neural networks until they make the desired moves in the training data.
// any time a neural network makes better moves, save it back to local storage.
function trainer() {
  return null;
  const trainingData = JSON.parse(window.localStorage.getItem("trainingData"));

  if (trainingData.length === 0) return null;

  let newNeuralNetwork = createNeuralNetwork();

  // GLOBAL.boardState = initializeBoardState()
  // GLOBAL.nextPlayerTurn = PLAYERS.PLAYER_ONE
  // return
  // buildBoard()
  // while (true) {
  //   makeBotMove(bestNeuralNetwork)
  //   if (getGameState(GLOBAL.boardState) === GAME_STATE.PLAYER_ONE) {
  //     return
  //   }
  //   makeBotMove(newNeuralNetwork)
  //   if (getGameState(GLOBAL.boardState) === GAME_STATE.PLAYER_TWO) {
  //     bestNeuralNetwork = newNeuralNetwork
  //     return
  //   }
  // }

  return;
  debugger;
  let count = 0;
  console.log(bestNeuralNetwork[0]);
  // return null

  while (count < 2000) {
    count++;
    mutateNetwork(bestNeuralNetwork);
    debugger;
    let newPerformance = getPerformance(bestNeuralNetwork);
    console.log(baselinePerformance, newPerformance);
    if (newPerformance > baselinePerformance) {
      saveNeuralNetworkToLocalStorage(bestNeuralNetwork);
      return;
      console.log("performance has improved due to mutation!");
      debugger;
    } else if (newPerformance < baselinePerformance) {
      // reinitialize original neural network
      bestNeuralNetwork = JSON.parse(
        window.localStorage.getItem("connectFourNeuralNetwork")
      );
    }
  }
  debugger;
  console.log("baseline performance", baselinePerformance);
  // get baseline neural network performance as a % of correct moves made

  // if a mutation of the neural network has a higher performance on average then save it to local storage
}

setInterval(trainer, 1000);

// mutates the neural network up to the coefficient amount which by default is 3% per synapse.
function mutateNetwork(neuralNetwork, mutationCoefficient = 0.1) {
  for (let layer_index = 0; layer_index < neuralNetwork.length; layer_index++) {
    const layer = neuralNetwork[layer_index];
    for (
      let parentNeuronIndex = 0;
      parentNeuronIndex < layer.length;
      parentNeuronIndex++
    ) {
      const parentNeuron = layer[parentNeuronIndex];
      for (
        let synapseIndex = 0;
        synapseIndex < parentNeuron.childrenSynapse.length;
        synapseIndex++
      ) {
        // normalize synapse weight to be between 0 and 1
        const weight = parentNeuron.childrenSynapse[synapseIndex];

        parentNeuron.childrenSynapse[synapseIndex] = getRandom(
          weight - weight * mutationCoefficient,
          weight + weight * mutationCoefficient
        );
        if (parentNeuron.childrenSynapse[synapseIndex] < 0) {
          parentNeuron.childrenSynapse[synapseIndex] = 0;
        } else if (parentNeuron.childrenSynapse[synapseIndex] > 1) {
          parentNeuron.childrenSynapse[synapseIndex] = 1;
        }
      }
    }
  }
}

function sigmoid(t) {
  return 1 / (1 + Math.pow(Math.E, -t));
}

function getPerformance(neuralNetwork) {
  const trainingData = JSON.parse(window.localStorage.getItem("trainingData"));

  let correctOutcome = 0;
  for (let i = 0; i < trainingData.length; i++) {
    const trainingGlobal = trainingData[i].global;
    const neurons = applyGameStateToNeuralNetwork(
      neuralNetwork,
      trainingGlobal.boardState,
      trainingGlobal.nextPlayerTurn
    );

    const desiredMove = trainingData[i].moveMade;
    const column = indexOfMax(neurons.map(n => n.value));

    if (column === desiredMove) {
      correctOutcome++;
    }
  }

  return correctOutcome / trainingData.length;
}

// trainer();
