const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const rows = 20;
const cols = 10;

const block = 30;

let score = 0;

let board = [];

for(let r = 0; r < rows; r++){
    board[r] = [];

    for(let c = 0; c < cols; c++){
        board[r][c] = 0;
    }
}


const shapes = [

[
[1,1,1,1]
],


[
[1,1],
[1,1]
],


[
[0,1,0],
[1,1,1]
],


[
[1,0,0],
[1,1,1]
],


[
[0,0,1],
[1,1,1]
]

];


let piece = createPiece();


function createPiece(){

let shape =
shapes[
Math.floor(Math.random()*shapes.length)
];


return {

shape:shape,

x:3,

y:0

};

}



function draw(){

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);


drawBoard();

drawPiece();

}



function drawBoard(){

for(let r=0;r<rows;r++){

for(let c=0;c<cols;c++){


if(board[r][c]){

ctx.fillStyle="#00ff99";

ctx.fillRect(
c*block,
r*block,
block-1,
block-1
);


}


}

}

}




function drawPiece(){

ctx.fillStyle="#ff0066";


piece.shape.forEach((row,y)=>{

row.forEach((value,x)=>{


if(value){

ctx.fillRect(

(piece.x+x)*block,

(piece.y+y)*block,

block-1,

block-1

);


}


});


});


}



function moveDown(){

if(!collision(
piece.x,
piece.y+1
)){

piece.y++;

}

else{

freeze();

piece=createPiece();

}

draw();

}



function collision(x,y){

return piece.shape.some((row,dy)=>{

return row.some((value,dx)=>{

if(value){

let nx=x+dx;
let ny=y+dy;


return (

nx<0 ||

nx>=cols ||

ny>=rows ||

board[ny][nx]

);


}

return false;


});


});


}



function freeze(){


piece.shape.forEach((row,y)=>{

row.forEach((value,x)=>{


if(value){

board[piece.y+y][piece.x+x]=1;


}


});


});


score+=10;

document.getElementById("score").innerHTML =
"امتیاز: "+score;


}



document.addEventListener(
"keydown",
(e)=>{


if(e.key==="ArrowLeft"){

if(!collision(piece.x-1,piece.y))
piece.x--;

}


if(e.key==="ArrowRight"){

if(!collision(piece.x+1,piece.y))
piece.x++;

}



if(e.key==="ArrowDown"){

moveDown();

}


draw();


});


setInterval(
moveDown,
700
);


draw();