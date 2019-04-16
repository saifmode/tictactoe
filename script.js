const container = document.querySelectorAll('.container');
const squares = document.querySelectorAll('.square');
let player1sTurn = true;
let player2sTurn = false;
let gameOver = false;
let gameBoard = {
	a1: null, a2: null, a3: null,
	b1: null, b2: null, b3: null,
	c1: null, c2: null, c3: null
}


function addEventListeners() {
	squares.forEach(square => {
		square.addEventListener('click', selectSquare);
	})
}

function selectSquare(event) {
	if (gameOver) return;

	if (this.className === "square") {
		if (player1sTurn) {
			this.className = "square selected-player-1";
			gameBoard[this.id] = 'x';
			const thisSquare = document.getElementById(this.id);
			thisSquare.innerHTML += 'x';

		} else if (player2sTurn) {
			this.className = "square selected-player-2";
			gameBoard[this.id] = 'o';
			const thisSquare = document.getElementById(this.id);
			thisSquare.innerHTML += 'o';
		}

		player1sTurn = !player1sTurn;
		player2sTurn = !player2sTurn;
	}

	checkIfGameOver();
}

function checkIfGameOver(){
	// console.log(gameBoard);

	const victoryConditions = [
		['a1', 'a2', 'a3'], ['b1', 'b2', 'b3'], ['c1', 'c2', 'c3'],
		['a1', 'b1', 'c1'], ['a2', 'b2', 'c2'], ['a3', 'b3', 'c3'],
		['a1', 'b2', 'c3'], ['a3', 'b2', 'c1']
	];

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
}
console.log(squares)
init();