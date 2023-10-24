let width = 10;
let height = 10;
let gameStatus = "notStarted";
let startTime = -1;
let numMines = 0;
let numFlag = 0;

// false to not display true to display grid value
let gridValues = [...Array(10)].map(e => Array(10));
let gridDisplay = [...Array(10)].map(e => Array(10));
let nonMineCoord = [];

let count = 0;
for(let i = 0; i < 10; i++){
	for(let j = 0; j < 10; j++){
		gridValues[i][j] = 0;
		gridDisplay[i][j] = 'hidden';
	}
}

function addRandomMine(){
	let randomIndex = Math.floor(Math.random() * nonMineCoord.length);
	let position = nonMineCoord[randomIndex];

	let row = position[0];
	let col = position[1];
	gridValues[row][col] = 9;

	nonMineCoord.splice(randomIndex, 1);
}

// m is the number of mines
function generateMines(m){
	for(let i = 0; i < m; i++){
		addRandomMine();
	}
}

function calculateValues(m, n){
	for(let i = m-1; i <= m + 1; i++){
		for(let j = n - 1; j <= n + 1; j++){
			if(i >= 0 && i < width && j >= 0 && j < height){
				if(gridValues[i][j] !== 9){
					gridValues[i][j]++;
				}
			}
		}
	}
}

function calcAroundMine(){
	for(let i = 0; i < width; i++){
		for(let j = 0; j < height; j++){
			if(gridValues[i][j] === 9){
				calculateValues(i, j);
			}
		}
	}
}

let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
canvas.width = 180;
canvas.height = 223;

// canvas.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
// canvas.fillRect( 1, 1, 1, 1 );

const myImgElement = document.getElementById("myImag");

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// empty box
// Example: ctx.drawImage( myImgElement, 14, 195, 16, 16, 0, 0, 16, 16);

ctx.imageSmoothingEnabled = false;

// upper left corner
ctx.drawImage( myImgElement, 475, 376, 12, 55, 0, 0, 12, 55);
// top border
for(let i = 0; i < 10; i ++){
	ctx.drawImage( myImgElement, 535, 376, 16, 55, 12+i*16, 0, 16, 55);
}

// upper right corner
ctx.drawImage( myImgElement, 743, 376, 8, 55, 172, 0, 8, 55);
// right border
for(let i = 0; i < 10; i++){
	ctx.drawImage( myImgElement, 743, 431, 8, 16, 172, 55+i*16, 8, 16);
}

// lower right corner
ctx.drawImage( myImgElement, 743, 687, 8, 8, 172, 215, 8, 8);
// bottom border
for(let i = 0; i < 10; i++){
	ctx.drawImage( myImgElement, 727, 687, 16, 8, 156-i*16, 215, 16, 8);
}

// lower left corner
ctx.drawImage( myImgElement, 475, 687, 12, 8, 0, 215, 12, 8);
// left border
for(let i = 0; i < 10; i++){
	ctx.drawImage( myImgElement, 475, 671, 12, 16, 0, 199-i*16, 12, 16);
}

// Mines counter
ctx.drawImage( myImgElement, 491, 391, 41, 25, 16, 15, 41, 25);

// Time counter
ctx.drawImage( myImgElement, 491, 391, 41, 25, 125, 15, 41, 25);

// Face
ctx.drawImage( myImgElement, 602, 391, 26, 26, 79, 15, 26, 26);

// positions for the image boxes
const boxImage = new Map();
boxImage.set('hidden', [14, 195]);
boxImage.set('blank', [31, 195]);
boxImage.set('flag', [48, 195]);
boxImage.set('mine', [99, 195]);
boxImage.set('wrongMine', [116, 195]);
boxImage.set('notMine', [133, 195]);
boxImage.set('1', [14, 212]);
boxImage.set('2', [31, 212]);
boxImage.set('3', [48, 212]);
boxImage.set('4', [65, 212]);
boxImage.set('5', [82, 212]);
boxImage.set('6', [99, 212]);
boxImage.set('7', [116, 212]);
boxImage.set('8', [133, 212]);

function updateGrid(){
	for(let i = 0; i < 10; i++){
		for(let j = 0; j < 10; j++){
			let position;
			if(gridDisplay[i][j] === "hidden"){
				position = boxImage.get('hidden');
			}else if(gridDisplay[i][j] === "flag"){
				position = boxImage.get('flag');
			}else{
				switch(gridValues[i][j]){
					case 0:
						position = boxImage.get('blank');
						break;
					case 1:
						position = boxImage.get('1');
						break;
					case 2:
						position = boxImage.get('2');
						break;
					case 3:
						position = boxImage.get('3');
						break;
					case 4:
						position = boxImage.get('4');
						break;
					case 5:
						position = boxImage.get('5');
						break;
					case 6:
						position = boxImage.get('6');
						break;
					case 7:
						position = boxImage.get('7');
						break;
					case 8:
						position = boxImage.get('8');
						break;
					case 9:
						position = boxImage.get('mine');
						break;
					case 10: 
						position = boxImage.get('wrongMine');
						break;
					case 11:
						position = boxImage.get('notMine');
						break;
				}
			}
			ctx.drawImage( myImgElement, position[0], position[1], 16, 16, j*16 + 12, i*16 + 55, 16, 16);
		}
	}
}
updateGrid();

canvasElem = document.querySelector("canvas");

// prevent right click menu
canvasElem.oncontextmenu = e => {
	e.preventDefault();
	e.stopPropagation();
};

async function showBoxes(m, n){
	if(m < 0 || n < 0 || m >= width || n >= height){
		return;
	}

	if(gridDisplay[m][n] === "flag"){
		return;
	}

	if(gridDisplay[m][n] !== "" && gridValues[m][n] === 0){
		gridDisplay[m][n] = "";
		for(let i = m - 1; i <= m + 1; i++){
			for(let j = n - 1; j <= n + 1; j++){
				if(i !== m || j !== n){
					showBoxes(i, j);
				}
			}
		}
	}

	await new Promise(resolve => setTimeout(resolve, 1));
	gridDisplay[m][n] = "shown";
}

function showAllMines(){
	for(let i = 0; i < 10; i++){
		for(let j = 0; j < 10; j++){
			if(gridValues[i][j] === 9 && gridDisplay[i][j] !== "flag"){
				gridDisplay[i][j] = "shown";
			}
		}
	}
}

function flagAllMines(){
	for(let i = 0; i < 10; i++){
		for(let j = 0; j < 10; j++){
			if(gridValues[i][j] === 9){
				gridDisplay[i][j] = "flag";
			}
		}
	}
	
}

function showWrongMines() {
	for(let i = 0; i < 10; i++){
		for(let j = 0; j < 10; j++){
			if(gridDisplay[i][j] === "flag" && gridValues[i][j] !== 9){
				gridValues[i][j] = 11;
				gridDisplay[i][j] = "shown";
			}
		}
	}
}

let isHold = false;

canvasElem.addEventListener("mousedown", async e => {
	isHold = true;
});

canvasElem.addEventListener("mouseup", async e => {
	isHold = false;

	// get mouse position
	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;
	
	if(79 <= x && 15 <= y && x <= 105 && y <= 41){
		resetGame();
	}


	if(gameStatus === "gameOver" || gameStatus === "gameWon"){
		return;
	}

	if(x < 12 || y < 55 || x > 169 || y > 215)
		return;

	let row = Math.floor((y - 55)/16);
	let col = Math.floor((x - 12)/16);

	// right click
	if(e.button === 2){
		if (gameStatus === "notStarted")
			return;

		if(gridDisplay[row][col] === "flag"){
			gridDisplay[row][col] = "hidden";
			numFlag--;
		}else if(gridDisplay[row][col] === "hidden"){
			gridDisplay[row][col] = "flag"
			numFlag++;
		}
		updateGuess();
	}

	if(e.button === 0){

		if( gameStatus === "notStarted"){
			for(let i = 0; i < 10; i++){
				for(let j = 0; j < 10;j++){
					if(!(row === i && col === j)){
						nonMineCoord.push([i, j]);
					}
				}
			}

			generateMines(10);
			numMines = 10;
			updateGuess();

			calcAroundMine();
			startTime = new Date().getTime();
			gameStatus = "started";
			timer();
		}

		if(gridDisplay[row][col] === "hidden"){
			if(gridValues[row][col] == 9){
				gridValues[row][col] = 10;
				gameStatus = "gameOver";
				showAllMines();
				showWrongMines();
			}
			showBoxes(row, col);
		}

		await new Promise(resolve => setTimeout(resolve, 10));
		let count = 0;
		for(let i = 0; i < 10; i++){
			for( let j = 0; j < 10; j++){
				if(gridDisplay[i][j] === "hidden" || gridDisplay[i][j] === "flag"){
					count++;
				}
			}
		}
		await new Promise(resolve => setTimeout(resolve, 10));
		if(count === numMines){
			gameStatus = "gameWon";
			console.log("win")
			flagAllMines();
		}
	}

	await new Promise(resolve => setTimeout(resolve, 100));
	updateGrid();
})

let prevRow = -1;
let prevCol = -1;
let row = 0;
let col = 0;
document.addEventListener('mousemove', e => {
	if( e.buttons === 0 || e.buttons === 2)
		return

    if (isHold) {
		
		let rect = canvas.getBoundingClientRect();
			
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;

		let row = Math.floor((y - 55)/16);
		let col = Math.floor((x - 12)/16);

		if(79 <= x && 15 <= y && x <= 105 && y <= 41){
			
		}

		if(12 <= x && 55 <= y && x <= 169 && y <= 215){
			if(gridDisplay[row][col] === "hidden"){
				if(prevRow !== row || prevCol !== col){
			
					if( prevRow !== -1 && prevCol !== -1 && gridDisplay[prevRow][prevCol] !== "shown") {
						let position = boxImage.get("hidden");
						ctx.drawImage( myImgElement, position[0], position[1], 16, 16, prevCol*16 + 12, prevRow*16 + 55, 16, 16);
					}

					position = boxImage.get("blank");
					ctx.drawImage( myImgElement, position[0], position[1], 16, 16, col*16 + 12, row*16 + 55, 16, 16);
					
					prevRow = row;
					prevCol = col;

				}
					
			}
		}

	}
})

async function timer() {
	let timePassSec = 0;
	while(gameStatus === "started"){
		timePassSec++;
		updateTime(timePassSec);
		await new Promise(resolve => setTimeout(resolve, 1000));
	}
}

// 12 22
let pixelTime = new Map();
pixelTime.set("1", [15, 147]);
pixelTime.set("2", [29, 147]);
pixelTime.set("3", [43, 147]);
pixelTime.set("4", [57, 147]);
pixelTime.set("5", [71, 147]);
pixelTime.set("6", [85, 147]);
pixelTime.set("7", [99, 147]);
pixelTime.set("8", [113, 147]);
pixelTime.set("9", [127, 147]);
pixelTime.set("0", [141, 147]);
pixelTime.set("-", [155, 147]);
pixelTime.set(" ", [169, 147]);

let digitZero = pixelTime.get("0");
ctx.drawImage( myImgElement, digitZero[0], digitZero[1], 12, 22, 18, 17, 12, 22);
ctx.drawImage( myImgElement, digitZero[0], digitZero[1], 12, 22, 31, 17, 12, 22);
ctx.drawImage( myImgElement, digitZero[0], digitZero[1], 12, 22, 44, 17, 12, 22);

ctx.drawImage( myImgElement, digitZero[0], digitZero[1], 12, 22, 127, 17, 12, 22);
ctx.drawImage( myImgElement, digitZero[0], digitZero[1], 12, 22, 140, 17, 12, 22);
ctx.drawImage( myImgElement, digitZero[0], digitZero[1], 12, 22, 153, 17, 12, 22);

function updateTime(seconds){
	let secStr = seconds.toString().padStart(3, "0");

	let position = 0;

	position = pixelTime.get(secStr[0]);
	ctx.drawImage( myImgElement, position[0], position[1], 12, 22, 127, 17, 12, 22);
	position = pixelTime.get(secStr[1]);
	ctx.drawImage( myImgElement, position[0], position[1], 12, 22, 140, 17, 12, 22);
	position = pixelTime.get(secStr[2]);
	ctx.drawImage( myImgElement, position[0], position[1], 12, 22, 153, 17, 12, 22);
}

function updateGuess(){
	let guessStr;

	
	let position;
	let diffGuess = numMines - numFlag;

	if(numMines - numFlag < 0){
		diffGuess = Math.abs(numMines - numFlag);
	}

	guessStr = diffGuess.toString().padStart(3, "0");

	if(numMines - numFlag < 0){
		position = pixelTime.get("-");
	} else {
		position = pixelTime.get(guessStr[0]);
	}

	ctx.drawImage( myImgElement, position[0], position[1], 12, 22, 18, 17, 12, 22);
	position = pixelTime.get(guessStr[1]);
	ctx.drawImage( myImgElement, position[0], position[1], 12, 22, 31, 17, 12, 22);
	position = pixelTime.get(guessStr[2]);
	ctx.drawImage( myImgElement, position[0], position[1], 12, 22, 44, 17, 12, 22);
}

function resetGame() {
	for(let i = 0; i < 10; i++){
		for(let j = 0; j < 10; j++){
			gridValues[i][j] = 0;
			gridDisplay[i][j] = "hidden";
		}
	}
	gameStatus = "notStarted";
	numMines = 0;
	numFlag = 0;

	updateGrid();
	updateGuess();
	updateTime(0);
}
