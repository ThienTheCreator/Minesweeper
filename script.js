let width = 10;
let height = 10;

var myGrid = [...Array(10)].map(e => Array(10));
console.log(myGrid);
let count = 0;
for(let i = 0; i < 10; i++){
    for(let j = 0; j < 10; j++){
        myGrid[i][j] = count;
        count += 1;
    }
}

// 16 x 16 pixel square

const img = document.get

let canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
canvas.width = 177;
canvas.height = 178;

// canvas.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
// canvas.fillRect( 1, 1, 1, 1 );

const myImgElement = document.getElementById("myImag")

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// empty box
// Example: ctx.drawImage( myImgElement, 14, 195, 16, 16, 0, 0, 16, 16);
ctx.imageSmoothingEnabled = false;
ctx.drawImage( myImgElement, 478, 422, 9, 9, 0, 0, 9, 9);
for(let i = 0; i < 10; i ++){
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage( myImgElement, 487, 422, 16, 9, 9+i*16, 0, 16, 9);
}

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

for(let i = 0; i < 160; i += 16){
    for(let j = 0; j < 160; j += 16){
        ctx.drawImage( myImgElement, 14, 195, 16, 16, i+9, j+9, 16, 16);
    }
}




function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    document.getElementById('output').innerText = x + ", " + y;
  }
  
  canvasElem = document.querySelector("canvas");
  
  canvasElem.addEventListener("mousedown", function(e) {
    getMousePosition(canvasElem, e);
  });
  
  canvasElem.dispatchEvent(new MouseEvent("mousedown", {
    clientX: 50,
    clientY: 50
  }));