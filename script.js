let width = 10;
let height = 10;
let gameStatus = "notStarted";

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
canvas.width = 178;
canvas.height = 178;

// canvas.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
// canvas.fillRect( 1, 1, 1, 1 );

const myImgElement = document.getElementById("myImag");

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// empty box
// Example: ctx.drawImage( myImgElement, 14, 195, 16, 16, 0, 0, 16, 16);
ctx.imageSmoothingEnabled = false;
ctx.drawImage( myImgElement, 478, 422, 9, 9, 0, 0, 9, 9);
for(let i = 0; i < 10; i ++){
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage( myImgElement, 487, 422, 16, 9, 9+i*16, 0, 16, 9);
}

// display border around grid
ctx.imageSmoothingEnabled = false;
ctx.drawImage( myImgElement, 743, 422, 8, 9, 169, 0, 8, 9);
for(let i = 0; i < 10; i++){
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage( myImgElement, 743, 431, 8, 16, 169, 9+i*16, 8, 16);
}

ctx.imageSmoothingEnabled = false;
ctx.drawImage( myImgElement, 743, 687, 8, 8, 169, 169, 8, 8);
for(let i = 0; i < 10; i++){
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage( myImgElement, 727, 687, 16, 8, 153-i*16, 169, 16, 8);
}

ctx.imageSmoothingEnabled = false;
ctx.drawImage( myImgElement, 478, 687, 9, 8, 0, 169, 9, 8);
for(let i = 0; i < 10; i++){
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage( myImgElement, 478, 671, 9, 16, 0, 153-i*16, 9, 16);
}

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
			ctx.drawImage( myImgElement, position[0], position[1], 16, 16, j*16 + 9, i*16 + 9, 16, 16);
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
			if(gridValues[i][j] === 9){
				gridDisplay[i][j] = "shown";
			}
		}
	}
}

function showNotMines() {
	for(let i = 0; i < 10; i++){
		for(let j = 0; j < 10; j++){
			if(gridDisplay[i][j] === "flag"){
				gridValues[i][j] = 11;
				gridDisplay[i][j] = "shown";
			}
		}
	}
}

canvasElem.addEventListener("mousedown", async e => {

	// get mouse position
	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;

	if(x < 9 || y < 9 || x > 168 || y > 168 || gameStatus === "finished")
		return;

	let row = Math.floor((y - 9)/16);
	let col = Math.floor((x - 9)/16);

	// right click
	if(e.button === 2){
		if(gridDisplay[row][col] === "flag"){
			gridDisplay[row][col] = "hidden";
		}else if(gridDisplay[row][col] === "hidden"){
			gridDisplay[row][col] = "flag"
		}
	}

	if(e.button === 0){
		if(gameStatus === "gameOver"){
			return;
		}

		if( gameStatus === "notStarted"){
			for(let i = 0; i < 10; i++){
				for(let j = 0; j < 10;j++){
					if(gridValues[i][j] === 0 && (row !== i && col !== j)){
						nonMineCoord.push([i, j]);
					}
				}
			}

			generateMines(10);

			calcAroundMine();

			gameStatus = "started";
		}

		if(gridDisplay[row][col] === "hidden"){
			if(gridValues[row][col] == 9){
				gridValues[row][col] = 10;
				gameStatus = "gameOver";
				showAllMines();
				showNotMines();
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
		if(count == 10){
			gameStatus = "gameOver";
			console.log("win")
			showAllMines();
			showNotMines();
		}
	}

	await new Promise(resolve => setTimeout(resolve, 100));
	updateGrid();
});
