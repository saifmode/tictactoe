// STUFF LEFT TO DO:
/* 
	create UI so user can select difficulty level, reset board etc
	finish the perfect AI, with ability to spot forks
	maybe create other types of AI, make different irratic modes etc
*/

// 🌍 Global variables 🌍
const container = document.querySelectorAll('.container');
const squares = document.querySelectorAll('.square');
let computerHasMoved = false;
let gameOver = false;
const gameBoard = {
	a1: null, a2: null, a3: null,
	b1: null, b2: null, b3: null,
	c1: null, c2: null, c3: null
};
// 🎛 Dynamic data 🎛
let movesPlayed = [];
let player1sMoves = [];
let player2sMoves = [];
// 💾 Static data 💾
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
const allSquares = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'];
// 🕹 Playability variables 🕹
let player1sTurn = true;
let player2sTurn = false;
let humanVsComputer = true;
let computerGoesFirst = false;
let difficulty = 2;

function addEventListeners() {
	squares.forEach(square => {
		square.addEventListener('click', selectSquare);
	})
}

function selectPlayers() {
	// if you want to be player 2, just switch player2sturn to true here
	// jump to think
	if (computerGoesFirst) {
		think();
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
		think();
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

// 🔮 AI 🔮
function think() {
	computerHasMoved = true;
	switch(difficulty) {
		case 1:
			playRandomSquare();
			break;
		case 2:
			playCompetitively();
			break;
		case 3:
			playPerfectly();
			break;
		case 0: 
			playIrratically();
			break;
	}
}

function playPerfectly() {
	console.log('playing perfectly...')
	// Computer goes first
	if (!movesPlayed.length) {
	const computersMove = bestFirstMoves[Math.floor(Math.random() * bestFirstMoves.length)];
	document.getElementById(computersMove).click();
	} else if (movesPlayed.length === 2) {
		playCompetitively();
	} else if (movesPlayed.length === 4) {
		playCompetitively();
	} else if (movesPlayed.length === 6) {
		playCompetitively();
	} else if (movesPlayed.length === 8) {

	} 

	// Human goes first
	else if (movesPlayed.length === 1) {
		if (cornerSquares.includes(movesPlayed[0])) {
			document.getElementById(centerSquare).click();
		} else if (movesPlayed[0] === centerSquare) {
			const computersMove = cornerSquares[Math.floor(Math.random() * cornerSquares.length)];
			document.getElementById(computersMove).click();
		} else {
			document.getElementById(centerSquare).click();
		}

	} else if (movesPlayed.length === 3) {
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
		} else {
			if (!winningMove(1)) {
				console.log('used to shrug...') //  write a function that checks for enemy forks
				playRandomSquare();
			} else {
				document.getElementById(winningMove(1)).click()
			}
		}

	} else if (movesPlayed.length === 5) {
		playCompetitively();

	} else if (movesPlayed.length === 7) {
		playCompetitively();
		
	} else if (movesPlayed.length === 9) {
		playCompetitively();
		
	}
}

function playCompetitively() {
	console.log('playing competitively...')
	console.log('Thinking competitively but short sightedly. Checking winning moves for me')
	if (!winningMove(2)) { 
		console.log('nothing there for me, checking winning moves for you')
		if (!winningMove(1)) { 
			console.log("Nothing immediately grabs me, I'll pick something at random.")
			playRandomSquare();
		} else {
			document.getElementById(winningMove(1)).click()
		}
	} else {
		document.getElementById(winningMove(2)).click()
	}
}

function playRandomSquare() {
	console.log('playing randomly...')
	document.getElementById(randomSquare()).click();
}

function playIrratically() {
	console.log('(playing irratically)')
	let randomDifficulty = Math.floor(Math.random() * 3);
	switch(randomDifficulty) {
		case 0:
			playRandomSquare();
			break;
		case 1:
			playCompetitively();
			break;
		case 2:
			playPerfectly();
	}
}

// 🛠 AI helpers 🛠
function randomSquare() {
	console.log(remainingSquares())
	return remainingSquares()[Math.floor(Math.random() * remainingSquares().length)]
}

function attemptCheckMate() {

}

function remainingSquares() {
	let _remainingSquares = [];
	allSquares.forEach(square => {
		if (!movesPlayed.includes(square))
			_remainingSquares.push(square)
	})

	return _remainingSquares;
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

// 🎭 Storyboard 🎭
function checkIfGameOver(){
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