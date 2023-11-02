let totalColumns = 10;
let totalRows = 10;
let gameStatus = "notStarted";
let startTime = -1;
let totalMines = 10;
let numberOfFlags = 0;

// false to not display true to display grid value
let gridValues = [...Array(30)].map(e => Array(16));
let gridDisplay = [...Array(30)].map(e => Array(16));
let nonMineCoord = [];

let count = 0;

const sleep = (ms) => new Promise(res => setTimeout(res, ms));


let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const myImgElement = document.getElementById("myImag");

let boxImage = new Map();

let pixelTime = new Map();

function setupCanvas(difficulty){

if(difficulty === "beginner"){
	totalColumns = 10;
	totalRows = 10;
	totalMines = 10;
}

if(difficulty === "intermediate"){
	totalColumns = 16;
	totalRows = 16;
	totalMines = 40;
}

if(difficulty === "expert"){
	totalColumns = 30;
	totalRows = 16;
	totalMines = 99;
}
	
	for(let i = 0; i < totalRows; i++){
		for(let j = 0; j < totalColumns; j++){
			gridValues[i][j] = 0;
			gridDisplay[i][j] = 'hidden';
		}
	}

ctx.imageSmoothingEnabled = false;
canvas.width = 16 * totalColumns + 20;
canvas.height = 16 * totalRows + 63;

// canvas.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
// canvas.fillRect( 1, 1, 1, 1 );

class Sprite {
	// sx and sy is the top left corner of sub-rectangle of source
	constructor(sx, sy, sWidth, sHeight) {
		this.sx = sx;
		this.sy = sy;
		this.width = width;
		this.height = height;
	}
}

// TODO
function drawSprite(sprite, dx, dy){

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// draw empty square at top left corner
// Example: ctx.drawImage( myImgElement, 14, 195, 16, 16, 0, 0, 16, 16);

}


ctx.imageSmoothingEnabled = false;

// top left corner
ctx.drawImage( myImgElement, 475, 376, 12, 55, 0, 0, 12, 55);
// top border
for(let i = 0; i < totalColumns; i ++){
	ctx.drawImage( myImgElement, 535, 376, 16, 55, (16 * i + 12), 0, 16, 55);
}

// top right corner
ctx.drawImage( myImgElement, 743, 376, 8, 55, (16 * totalColumns + 12), 0, 8, 55);
// right border
for(let i = 0; i < totalRows; i++){
	ctx.drawImage( myImgElement, 743, 431, 8, 16, (16 * totalColumns + 12), (16 * i + 55), 8, 16);
}

// bottom right corner
ctx.drawImage( myImgElement, 743, 687, 8, 8, (16 * totalColumns + 12), (16 * totalRows + 55), 8, 8);
// bottom border
for(let i = 0; i < totalColumns; i++){
	ctx.drawImage( myImgElement, 727, 687, 16, 8, ((16 * totalColumns - 4) - 16 * i), (totalRows * 16 + 55), 16, 8);
}

// bottom left corner
ctx.drawImage( myImgElement, 475, 687, 12, 8, 0, (16 * totalRows + 55), 12, 8);
// left border
for(let i = 0; i < totalRows; i++){
	ctx.drawImage( myImgElement, 475, 671, 12, 16, 0, ((16 * totalRows + 39) - 16 * i), 12, 16);
}

// Mines counter background
ctx.drawImage( myImgElement, 491, 391, 41, 25, 16, 15, 41, 25);

// Time counter background
ctx.drawImage( myImgElement, 491, 391, 41, 25, (16 * (totalColumns - 3) + 13), 15, 41, 25);

// Face
ctx.drawImage( myImgElement, 602, 391, 26, 26, (16 * (totalColumns >> 1) - 1), 15, 26, 26);

updateGrid();
updateGuess();
updateTime(0);
}


async function setup() {
	await sleep(10);

// positions for the image boxes
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

setupCanvas("beginner");
}

setup();

async function addRandomMine(){
	let randomIndex = Math.floor(Math.random() * nonMineCoord.length);
	let position = nonMineCoord[randomIndex];

	let row = position[0];
	let col = position[1];
	gridValues[row][col] = 9;

	nonMineCoord.splice(randomIndex, 1);
}

let tempMines = 0;
// m is the number of mines
function generateMines(m){
	for(let i = 0; i < m; i++){
		addRandomMine();
	}
}

// Calculates the values around a mine
// 3 by 3 squares where mine is in the middle
function incrementValuesAround(row, col){
	for(let i = row-1; i <= row + 1; i++){
		for(let j = col - 1; j <= col + 1; j++){
			if(i >= 0 && i < totalRows && j >= 0 && j < totalColumns){
				if(gridValues[i][j] !== 9){
					gridValues[i][j]++;
				}
			}
		}
	}
}

function calculateValues(){
	for(let i = 0; i < totalRows; i++){
		for(let j = 0; j < totalColumns; j++){
			if(gridValues[i][j] === 9){
				incrementValuesAround(i, j);
			}
		}
	}
}

function updateGrid(){
	for(let i = 0; i < totalRows; i++){
		for(let j = 0; j < totalColumns; j++){
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

canvasElem = document.querySelector("canvas");

// prevent right click menu
canvasElem.oncontextmenu = e => {
	e.preventDefault();
	e.stopPropagation();
};

async function showBoxes(row, col){
	if(row < 0 || col < 0 || row >= totalRows || col >= totalColumns){
		return;
	}

	if(gridDisplay[row][col] === "flag"){
		return;
	}

	if(gridDisplay[row][col] !== "" && gridValues[row][col] === 0){
		gridDisplay[row][col] = "";
		for(let i = row - 1; i <= row + 1; i++){
			for(let j = col - 1; j <= col + 1; j++){
				if(i !== row || j !== col){
					showBoxes(i, j);
				}
			}
		}
	}

	await sleep(1);
	gridDisplay[row][col] = "shown";
}

function showAllMines(){
	for(let i = 0; i < totalRows; i++){
		for(let j = 0; j < totalColumns; j++){
			if(gridValues[i][j] === 9 && gridDisplay[i][j] !== "flag"){
				gridDisplay[i][j] = "shown";
			}
		}
	}
}

function flagAllMines(){
	for(let i = 0; i < totalRows; i++){
		for(let j = 0; j < totalColumns; j++){
			if(gridValues[i][j] === 9){
				gridDisplay[i][j] = "flag";
			}
		}
	}
	numberOfFlags = totalMines
}

function showWrongMines() {
	for(let i = 0; i < totalRows; i++){
		for(let j = 0; j < totalColumns; j++){
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

	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;
	
	let row = Math.floor((y - 55) / 16);
	let col = Math.floor((x - 12) / 16);

	if(16 * (totalColumns >> 1) - 1 <= x && x <= 16 * (totalColumns >> 1) + 25 && 15 <= y && y <= 41){
		ctx.drawImage( myImgElement, 39, 170, 24, 24, 16 * (totalColumns >> 1), 16, 24, 24);
	}

	if(gameStatus === "gameOver" || gameStatus === "gameWon")
		return;

	// check for pixels boundaries for squares
	if(11 <= x && x <= 16 * totalColumns + 11 && 55 <= y && y <= 16 * totalRows + 55) {

		// right click
		if(e.button === 2){
			if (gameStatus === "notStarted" || gameStatus === "gameWon")
				return;

			if(gridDisplay[row][col] === "flag"){
				gridDisplay[row][col] = "hidden";
				numberOfFlags--;
			}else if(gridDisplay[row][col] === "hidden"){
				gridDisplay[row][col] = "flag"
				numberOfFlags++;
			}

			updateGuess();
			updateGrid();
			return;
		}

		// assume left click
		if(gridDisplay[row][col] === "hidden"){
			let position = boxImage.get("blank");
			ctx.drawImage( myImgElement, position[0], position[1], 16, 16, 16 * col + 12, 16 * row + 55, 16, 16);
		}
	}


});

canvasElem.addEventListener("mouseup", async e => {
	isHold = false;

	// get mouse position
	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;
	
	if(16 * (totalColumns >> 1) - 1 <= x && x <= 16 * (totalColumns >> 1) + 25 && 15 <= y && y <= 41){
		ctx.drawImage( myImgElement, 14, 170, 24, 24, 16 * (totalColumns >> 1), 16, 24, 24);
		resetGame();
	}


	if(gameStatus === "gameOver" || gameStatus === "gameWon"){
		return;
	}

	if(x < 11 || 16 * totalColumns + 11 < x || y < 55 || 16 * totalRows + 55 < y)
		return;

	let row = Math.floor((y - 55)/16);
	let col = Math.floor((x - 12)/16);


	if(e.button === 0){

		if( gameStatus === "notStarted"){
			for(let i = 0; i < totalRows; i++){
				for(let j = 0; j < totalColumns;j++){
					if(!(row === i && col === j)){
						nonMineCoord.push([i, j]);
					}
				}
			}

			generateMines(totalMines);
			updateGuess();

			calculateValues();
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

		await sleep(1);
		let count = 0;
		for(let i = 0; i < totalRows; i++){
			for( let j = 0; j < totalColumns; j++){
				if(gridDisplay[i][j] === "hidden" || gridDisplay[i][j] === "flag"){
					count++;
				}
			}
		}

		await sleep(1);
		if(count === totalMines){
			gameStatus = "gameWon";
			flagAllMines();
			updateGuess();
		}
	}

	await sleep(100);
	updateGrid();
})

let prevRow = -1;
let prevCol = -1;

document.addEventListener('mousemove', e => {
	if( e.buttons === 0 || e.buttons === 2)
		return

    if (isHold) {
		
		let rect = canvas.getBoundingClientRect();
			
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;

		let row = Math.floor((y - 55)/16);
		let col = Math.floor((x - 12)/16);

		if(16 * (totalColumns >> 1) - 1 <= x && x <= 16 * (totalColumns) + 25 && 15 <= y && y <= 41){
			ctx.drawImage( myImgElement, 39, 170, 24, 24, 16 * (totalColumns >> 1), 16, 24, 24);
		}else {
			ctx.drawImage( myImgElement, 14, 170, 24, 24, 16 * (totalColumns >> 1), 16, 24, 24);
		}

		if(gameStatus === "gameOver" || gameStatus === "gameWon")
			return;

		if(11 <= x && x <= 16 * totalColumns + 11 && 55 <= y && y <= 16 * totalRows + 55){
			if(gridDisplay[row][col] === "hidden"){
				if(prevRow !== row || prevCol !== col){
			
					if( prevRow !== -1 && prevCol !== -1 && gridDisplay[prevRow][prevCol] !== "shown") {
						let position = boxImage.get("hidden");
						ctx.drawImage( myImgElement, position[0], position[1], 16, 16, 16 * prevCol + 12, 16 * prevRow + 55, 16, 16);
					}

					position = boxImage.get("blank");
					ctx.drawImage( myImgElement, position[0], position[1], 16, 16, 16 * col + 12, 16 * row + 55, 16, 16);
					
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

// takes an Integer as seconds
function updateTime(seconds){
	let secStr = seconds.toString().padStart(3, "0");

	let position = 0;

	position = pixelTime.get(secStr[0]);
	ctx.drawImage( myImgElement, position[0], position[1], 12, 22, 16 * (totalColumns - 3) + 15, 17, 12, 22);
	position = pixelTime.get(secStr[1]);
	ctx.drawImage( myImgElement, position[0], position[1], 12, 22, 16 * (totalColumns - 3) + 28, 17, 12, 22);
	position = pixelTime.get(secStr[2]);
	ctx.drawImage( myImgElement, position[0], position[1], 12, 22, 16 * (totalColumns - 3) + 41, 17, 12, 22);
}

function updateGuess(){
	let guessStr;

	let position;
	let diffGuess = totalMines - numberOfFlags;

	if(totalMines - numberOfFlags < 0){
		diffGuess = Math.abs(totalMines - numberOfFlags);
	}

	guessStr = diffGuess.toString().padStart(3, "0");

	if(totalMines - numberOfFlags < 0){
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
	for(let i = 0; i < totalRows; i++){
		for(let j = 0; j < totalColumns; j++){
			gridValues[i][j] = 0;
			gridDisplay[i][j] = "hidden";
		}
	}
	gameStatus = "notStarted";
	numberOfFlags = 0;

	nonMineCoord = [];

	updateGrid();
	updateGuess();
	updateTime(0);
}

let isMenuOpen = false;
const dropdown = document.getElementById("dropdown-content");
const gameMenu = document.getElementById("game-menu");

function openGameMenu() {
	dropdown.className = "dropdown-content-shown";
	gameMenu.className = "blue-background";
	isMenuOpen = true;
}

function closeGameMenu() {
	dropdown.className = "dropdown-content-hidden";
	gameMenu.className = "none-background";
	isMenuOpen = false;
}

function handleGameMenu(){
	if( dropdown.className === "dropdown-content-hidden" ) {
		openGameMenu();
	} else {
		closeGameMenu();
	}
}

function handleNewClicked() {
	closeGameMenu();
	resetGame();
}

let difficulty = "beginner";

function hideCheck() {
	let checkBox = document.getElementsByClassName("checked-box");
	checkBox[0].className = "checked-box-hidden";
}

function setCheckedBox(difficulty) {
	let checkBox = document.getElementsByClassName("checked-box-hidden");
	let i = 0;

	if(difficulty === "beginner"){
		i = 1;
	}

	if(difficulty === "intermediate"){
		i = 2;
	}

	if(difficulty === "expert"){
		i = 3;
	}

	checkBox[i].className = "checked-box";
}

function handleDifficulty(difficulty) {
	closeGameMenu();
	hideCheck();
	setCheckedBox(difficulty);
	setupCanvas(difficulty);
	resetGame();
}
