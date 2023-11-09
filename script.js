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

let currentFace = "happy";

const sleep = (ms) => new Promise(res => setTimeout(res, ms));


let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const myImgElement = document.getElementById("myImag");

class Sprite {
	// sx and sy is the top left corner of sub-rectangle of source
	constructor(sx, sy, sWidth, sHeight) {
		this.sx = sx;
		this.sy = sy;
		this.width = sWidth;
		this.height = sHeight;
	}
}

let spriteMap = new Map();

function setupSpriteMap() {
	spriteMap.set("hidden"   , new Sprite( 14, 195, 16, 16));
	spriteMap.set("blank"    , new Sprite( 31, 195, 16, 16));
	spriteMap.set("flag"     , new Sprite( 48, 195, 16, 16));
	spriteMap.set("mine"     , new Sprite( 99, 195, 16, 16));
	spriteMap.set("wrongMine", new Sprite(116, 195, 16, 16));
	spriteMap.set("notMine"  , new Sprite(133, 195, 16, 16));
	spriteMap.set("square1"  , new Sprite( 14, 212, 16, 16));
	spriteMap.set("square2"  , new Sprite( 31, 212, 16, 16));
	spriteMap.set("square3"  , new Sprite( 48, 212, 16, 16));
	spriteMap.set("square4"  , new Sprite( 65, 212, 16, 16));
	spriteMap.set("square5"  , new Sprite( 82, 212, 16, 16));
	spriteMap.set("square6"  , new Sprite( 99, 212, 16, 16));
	spriteMap.set("square7"  , new Sprite(116, 212, 16, 16));
	spriteMap.set("square8"  , new Sprite(133, 212, 16, 16));

	spriteMap.set("red1", new Sprite( 15, 147, 12, 22));
	spriteMap.set("red2", new Sprite( 29, 147, 12, 22));
	spriteMap.set("red3", new Sprite( 43, 147, 12, 22));
	spriteMap.set("red4", new Sprite( 57, 147, 12, 22));
	spriteMap.set("red5", new Sprite( 71, 147, 12, 22));
	spriteMap.set("red6", new Sprite( 85, 147, 12, 22));
	spriteMap.set("red7", new Sprite( 99, 147, 12, 22));
	spriteMap.set("red8", new Sprite(113, 147, 12, 22));
	spriteMap.set("red9", new Sprite(127, 147, 12, 22));
	spriteMap.set("red0", new Sprite(141, 147, 12, 22));
	spriteMap.set("red-", new Sprite(155, 147, 12, 22));

	spriteMap.set("topLeftCorner",     new Sprite(475, 376, 12, 55));
	spriteMap.set("topBorder",         new Sprite(535, 376, 16, 55));
	spriteMap.set("topRightCorner",    new Sprite(743, 376,  8, 55));
	spriteMap.set("rightBorder",       new Sprite(743, 431,  8, 16));
	spriteMap.set("bottomRightCorner", new Sprite(743, 687,  8,  8));
	spriteMap.set("bottomBorder",      new Sprite(727, 687, 16,  8));
	spriteMap.set("bottomLeftCorner",  new Sprite(475, 687, 12,  8));
	spriteMap.set("leftBorder",        new Sprite(475, 671, 12, 16));

	spriteMap.set("numberBackground", new Sprite(491, 391, 41, 25));
	spriteMap.set("faceBackground",   new Sprite(602, 391, 26, 26));

	spriteMap.set("happy",    new Sprite( 14, 170, 24, 24));
	spriteMap.set("clicked" , new Sprite( 39, 170, 24, 24));
	spriteMap.set("suspense", new Sprite( 64, 170, 24, 24));
	spriteMap.set("cool",     new Sprite( 89, 170, 24, 24));
	spriteMap.set("dead",     new Sprite(114, 170, 24, 24));
}
setupSpriteMap();

function drawSprite(spriteName, dx, dy){

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// draw empty square at top left corner
// Example: ctx.drawImage( myImgElement, 14, 195, 16, 16, 0, 0, 16, 16);

	let sprite = spriteMap.get(spriteName);
	ctx.drawImage(myImgElement, 
		sprite.sx, sprite.sy, sprite.width, sprite.height, 
				   dx,        dy, sprite.width, sprite.height);
}


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

ctx.imageSmoothingEnabled = false;

drawSprite("topLeftCorner", 0, 0);
for(let i = 0; i < totalColumns; i ++){
	drawSprite("topBorder", (16*i + 12), 0);
}

drawSprite("topRightCorner", (16*totalColumns + 12), 0);
for(let i = 0; i < totalRows; i++){
	drawSprite("rightBorder", (16*totalColumns + 12), (16*i + 55));
}

drawSprite("bottomRightCorner", (16*totalColumns + 12), (16*totalRows + 55))
for(let i = 0; i < totalColumns; i++){
	drawSprite("bottomBorder", (16*totalColumns - 4 - 16 * i), (16*totalRows + 55));
}

drawSprite("bottomLeftCorner", 0, (16*totalRows + 55));
for(let i = 0; i < totalRows; i++){
	drawSprite("leftBorder", 0, (16*totalRows + 39 - 16*i));
}

drawSprite("numberBackground", 16, 15);
drawSprite("numberBackground", (16*(totalColumns - 3) + 13), 15);
drawSprite("faceBackground", (8*totalColumns - 1), 15);

updateGrid();
updateGuess();
updateTime(0);
}


async function setup() {
	await sleep(1);
	setupSpriteMap();
	setupCanvas("beginner");
	currentFace = "happy";
	changeFace(currentFace);
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
			if(gridDisplay[i][j] === "hidden" || gridDisplay[i][j] === "flag"){
				drawSprite(gridDisplay[i][j], 16*j + 12, 16*i + 55);
			} else {
				let spriteName = "blank";

				if(1 <= gridValues[i][j] && gridValues[i][j] <= 8){
					spriteName = "square" + gridValues[i][j];
				}

				if(gridValues[i][j] === 9)
					spriteName = "mine";

				if(gridValues[i][j] === 10)
					spriteName = "wrongMine";

				if(gridValues[i][j] === 11)
					spriteName = "notMine";

				drawSprite(spriteName, 16*j + 12, 16*i + 55);
			}
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

function changeFace(faceType) {
	drawSprite(faceType, 16*(totalColumns >> 1), 16);
}

let isHold = false;
canvasElem.addEventListener("mousedown", async e => {
	isHold = true;

	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;
	
	let row = Math.floor((y - 55) / 16);
	let col = Math.floor((x - 12) / 16);

	let leftBound = 16 * (totalColumns >> 1) - 1;
	let rightBound = 16 * (totalColumns >> 1) + 25;  
	let topBound = 15;
	let bottomBound = 41;

	// face boundaries
	if(leftBound <= x && x <= rightBound && topBound <= y && y <= bottomBound){
		changeFace("clicked")	
	}

	if(gameStatus === "gameOver" || gameStatus === "gameWon")
		return;

	// check for pixels boundaries for squares
	if(11 <= x && x <= 16 * totalColumns + 11 && 55 <= y && y <= 16 * totalRows + 55) {
		currentFace = "suspense";
		changeFace(currentFace);
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
			drawSprite("blank", 16*col + 12, 16*row + 55);
		}
	}


});

canvasElem.addEventListener("mouseup", async e => {
	isHold = false;

	// get mouse position
	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;

	let leftBound = 16 * (totalColumns >> 1) - 1;
	let rightBound = 16 * (totalColumns >> 1) + 25;  
	let topBound = 15;
	let bottomBound = 41;

	// face boundaries
	if( leftBound <= x && x <= rightBound && topBound <= y && y <= bottomBound){
		resetGame();
	}

	if(gameStatus === "gameOver" || gameStatus === "gameWon"){
		return;
	}

	if(x < 11 || 16 * totalColumns + 11 < x || y < 55 || 16 * totalRows + 55 < y) {
		currentFace = "happy";
		changeFace(currentFace);
		return;
	}

	let row = Math.floor((y - 55)/16);
	let col = Math.floor((x - 12)/16);


	if(e.button === 0){
		currentFace = "happy";

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
				currentFace = "dead";
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
			currentFace = "cool";
			flagAllMines();
			updateGuess();
		}
	}

	changeFace(currentFace);
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

		if(8 * (totalColumns) - 1 <= x && x <= 8 * (totalColumns) + 25 && 15 <= y && y <= 41){
			changeFace("clicked");
		}else {
			changeFace(currentFace);
		}

		if(gameStatus === "gameOver" || gameStatus === "gameWon")
			return;

		if(0 <= row && row < totalRows && 0 <= col && col < totalColumns){
			if(gridDisplay[row][col] === "hidden"){
				if(prevRow !== row || prevCol !== col){
			
					if( -1 < prevRow && -1 < prevCol && gridDisplay[prevRow][prevCol] !== "shown") {
						drawSprite("hidden", 16*prevCol + 12, 16*prevRow + 55);
					}

					drawSprite("blank", 16*col + 12, 16*row + 55);
					
					prevRow = row;
					prevCol = col;

				}
					
			}
		} else {
			if(-1 < prevRow && -1 < prevCol){
				drawSprite("hidden", 16*prevCol + 12, 16*prevRow + 55);	
			}
			prevRow = -1;
			prevCol = -1;
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

	drawSprite("red" + secStr[0], 16*totalColumns - 33, 17);
	drawSprite("red" + secStr[1], 16*totalColumns - 20, 17);
	drawSprite("red" + secStr[2], 16*totalColumns -  7, 17);
}

function updateGuess(){
	let guessStr;

	let spriteName;
	let diffGuess = totalMines - numberOfFlags;

	if(totalMines - numberOfFlags < 0){
		diffGuess = Math.abs(totalMines - numberOfFlags);
	}

	guessStr = diffGuess.toString().padStart(3, "0");

	if(totalMines - numberOfFlags < 0){
		spriteName = "red-";
	} else {
		spriteName = "red" + guessStr[0];
	}

	drawSprite(spriteName, 18, 17);
	drawSprite("red" + guessStr[1], 31, 17);
	drawSprite("red" + guessStr[2], 44, 17);
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
	if( dropdown.className === "dropdown-content-idden" ) {
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
