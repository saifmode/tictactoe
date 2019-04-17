const container = document.querySelectorAll('.container');
const squares = document.querySelectorAll('.square');
let computerHasMoved = false;
let gameOver = false;
const gameBoard = {
	a1: null, a2: null, a3: null,
	b1: null, b2: null, b3: null,
	c1: null, c2: null, c3: null
};
let movesPlayed = [];
let player1sMoves = [];
let player2sMoves = [];
// Data
const bestFirstMoves = ['a1', 'a3', 'b2', 'c1', 'c3'];
const cornerSquares = ['a1', 'a3', 'c1', 'c3'];
const edgeSquares = ['a2', 'b1', 'b3', 'c2']
const centerSquare = 'b2';
const oppositeCorners = [['a1', 'c3'], ['a3', 'c1']];
const sameSideCorners = [['a1', 'a3'], ['a1', 'c1'], ['a3', 'c3'], ['c1', 'c3']];
const adjacentEdges = [['a2', 'b1'], ['a2', 'b3'], ['b1', 'c2'], ['b3', 'c2']];
const oppositeEdges = [['a2', 'c2'], ['b1', 'b3']];
const victoryConditions = [
		['a1', 'a2', 'a3'], ['b1', 'b2', 'b3'], ['c1', 'c2', 'c3'],
		['a1', 'b1', 'c1'], ['a2', 'b2', 'c2'], ['a3', 'b3', 'c3'],
		['a1', 'b2', 'c3'], ['a3', 'b2', 'c1']
	];
// Playability variables
let player1sTurn = true;
let player2sTurn = false;
let humanVsComputer = true;
let computerGoesFirst = false;




function addEventListeners() {
	squares.forEach(square => {
		square.addEventListener('click', selectSquare);
	})
}

function selectPlayers() {
	// if you want to be player 2, just switch player2sturn to true here
	// jump to makeComputerThink
	if (computerGoesFirst) {
		makeComputerThink();
	}
}

function logMove(id) {
	movesPlayed.push(id);
	if (player1sTurn) {
		player1sMoves.push(id);
	} else {
		player2sMoves.push(id);
	}
}

function switchPlayers() {
	player1sTurn = !player1sTurn;
	player2sTurn = !player2sTurn;
}

function selectSquare(event) {
	if (gameOver) return;

	if (this.className === "square") makeMove(event);

	if (humanVsComputer && !computerHasMoved) {
		makeComputerThink();
	} else {
		computerHasMoved = false;
	}
}

function makeMove(event) {
	if (player1sTurn) {
			event.srcElement.className = "square selected-player-1";
			gameBoard[event.srcElement.id] = 'x';
			const thisSquare = document.getElementById(event.srcElement.id);
			thisSquare.innerHTML += 'x';
			logMove(event.srcElement.id);
			switchPlayers();

		} else if (player2sTurn) {
			event.srcElement.className = "square selected-player-2";
			gameBoard[event.srcElement.id] = 'o';
			const thisSquare = document.getElementById(event.srcElement.id);
			thisSquare.innerHTML += 'o';
			logMove(event.srcElement.id);
			switchPlayers();
		}
	checkIfGameOver();
}

function makeComputerThink() {
	computerHasMoved = true;
	// First move!
	// if computer is first to play, select from best moves
	if (!movesPlayed.length) {
		const computersMove = bestFirstMoves[Math.floor(Math.random() * bestFirstMoves.length)];
		document.getElementById(computersMove).click();

	} else if (movesPlayed.length === 1) {
		if (cornerSquares.includes(movesPlayed[0])) {
			document.getElementById(centerSquare).click();
		} else if (movesPlayed[0] === centerSquare) {
			const computersMove = cornerSquares[Math.floor(Math.random() * cornerSquares.length)];
			document.getElementById(computersMove).click();
		} else {
			document.getElementById(centerSquare).click();
		}

	} else if (movesPlayed.length === 3) {
		// if computer is in the centre, human must have gone corner or edge on last move
		// we'll check if human went with two edges, or two corners, or a combination of both
		const players1sFirstTwoMoves = player1sMoves.sort().join('')

		const playedSameSideCorners = sameSideCorners.some(pair => pair.join('') === players1sFirstTwoMoves);
		const playedOppositeCorners = oppositeCorners.some(pair => pair.join('') === players1sFirstTwoMoves);
		const playedAdjacentEdges = adjacentEdges.some(pair => pair.join('') === players1sFirstTwoMoves);
		const playedOppositeEdges = oppositeEdges.some(pair => pair.join('') === players1sFirstTwoMoves);

		if (playedSameSideCorners) {
			document.getElementById(winningMove(1)).click();

		} else if (playedOppositeCorners) { // *** perfect play.
			const computersMove = edgeSquares[Math.floor(Math.random() * edgeSquares.length)];
			document.getElementById(computersMove).click();

		} else if (playedAdjacentEdges) {
			if (players1sFirstTwoMoves === adjacentEdges[0].join('')) {
				document.getElementById('a1').click();
			} else if (players1sFirstTwoMoves === adjacentEdges[1].join('')) {
				document.getElementById('a3').click();
			} else if (players1sFirstTwoMoves === adjacentEdges[2].join('')) {
				document.getElementById('c1').click();
			} else if (players1sFirstTwoMoves === adjacentEdges[3].join('')) {
				document.getElementById('c3').click();
			}

		} else if (playedOppositeEdges) {
			const computersMove = cornerSquares[Math.floor(Math.random() * cornerSquares.length)];
			document.getElementById(computersMove).click()
		} else { // other combinations
			if (!winningMove(1)) {
				console.log('shrug')
			} else {
				document.getElementById(winningMove(1)).click()
			}
		}

	} else if (movesPlayed.length === 5) {
		// check for computer winning move first and do that. if no winning move, check player has winning move and intercept
		if (!winningMove(2)) {
			if (!winningMove(1)) {
				console.log("At a loose end...") // search for forks by checking each square for possible victories. if >1 route to victory then that's a fork and computer should play it
			} else {
				document.getElementById(winningMove(1)).click()
			}
		} else {
			document.getElementById(winningMove(2)).click()
		}

	} else if (movesPlayed.length === 7) {
		// check for computer winning move first and do that. if no winning move, check player has winning move and intercept
		if (!winningMove(2)) { // can the computer win? if so go for the kill
			if (!winningMove(1)) { // can the player win? if not, defend!
				console.log("Deeply at a loose end...") // no immediate path to victory for either player. search for forks by checking each square for possible victories. if >1 route to victory then that's a fork and computer should play it
			} else {
				document.getElementById(winningMove(1)).click()
			}
		} else {
			document.getElementById(winningMove(2)).click()
		}
		
	}
}

function winningMove(player) {

	let thisPlayersMoves = []
	let theWinningMove = false;
	let count = 0;

	if (player === 1) {
		thisPlayersMoves = player1sMoves
	} else {
		thisPlayersMoves = player2sMoves
	}
	
	victoryConditions.forEach(condition => {
		thisPlayersMoves.forEach(move => {
			if (condition.includes(move)) {
				count += 1;
			}
		})

		if (count > 1) {
			condition.forEach(move => {
				if (!movesPlayed.includes(move)) {
					theWinningMove = move;
				}
			})
			count = 0;
		} else {
			count = 0;
		}
	});

	return theWinningMove;
}

function arrayContainsArray (superset, subset) {
  if (0 === subset.length || superset.length < subset.length) {
    return false;
  }
  for(var i = 0; i < subset.length; i++) {
    if(superset.indexOf(subset[i]) === -1) return false;
  }
  return true;
}

function checkIfGameOver(){
	// console.log(gameBoard);
	victoryConditions.forEach(condition => {
		const player1HasWon = condition.every(square => 
			gameBoard[square] === 'x');
		const player2HasWon = condition.every(square => 
			gameBoard[square] === 'o');
		
		if (player1HasWon) {
			gameOver = true;
			endGame(condition);
		} else if (player2HasWon) {
			gameOver = true;
			endGame(condition);
		}
	})

}

function endGame(condition) {
	squares.forEach(square => {
		if (condition.includes(square.id)) {
			square.className = "square victory-square";
		}
	})
}

function init() {
	addEventListeners();
	selectPlayers();
}

init();