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
canvas.width = 160;
canvas.height = 160;

// canvas.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";
// canvas.fillRect( 1, 1, 1, 1 );

const myImgElement = document.getElementById("myImag")

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// empty box
// ctx.drawImage( myImgElement, 14, 195, 16, 16, 0, 0, 16, 16);
for(let i = 0; i < 160; i += 16){
    for(let j = 0; j < 160; j += 16){
        ctx.drawImage( myImgElement, 14, 195, 16, 16, i, j, 16, 16);
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