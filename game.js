const canvas =document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up')
const btnDown = document.querySelector('#down')
const btnRight = document.querySelector('#right')
const btnLeft = document.querySelector('#left')
const spanLives = document.querySelector('#lives')
const spanTime = document.querySelector('#time')
const spanRecord = document.querySelector('#record')
const pResult = document.querySelector('#result')


let canvasSize
let timeStart
let elementSize
let level = 0
let lives = 3 
let timePlayer
let timeInterval

const playerPosition = {
    x: undefined,
    y: undefined,
}

const giftPosition = {
    x: undefined,
    y: undefined,
}

let enemyPositions =[]

window.addEventListener('load', setCanvasSize)
window.addEventListener('resize', setCanvasSize)

function fixNumber(n){
    return Number(n.toFixed(0))
}

function setCanvasSize(){
    if (window.innerHeight>window.innerWidth){
        canvasSize=window.innerWidth*0.7
    }else{
        canvasSize=window.innerHeight*0.7
    }

    canvasSize = Number(canvasSize.toFixed(0))

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)
   
    elementSize = canvasSize/10
    playerPosition.x = undefined
    playerPosition.y = undefined
    startGame();
}

function startGame(){

    game.font = elementSize + 'px Verdana';
    game.textAlign ='end';

    const map = maps[level];

    if (!map){
        gameWin()
        return
    }

    if (!timeStart) {
        timeStart = Date.now()
        timeInterval = setInterval(showTime, 100)
        showRecord()
    }

    const mapRows=map.trim().split('\n');
    const mapRowsCol = mapRows.map(row => row.trim().split(''));

    showLives()

    enemyPositions=[]
    game.clearRect(0,0,canvasSize,canvasSize)

    mapRowsCol.forEach((row, rowI) => {
        row.forEach((col, colI) =>{
            const emoji= emojis[col];
            const posX= elementSize * (colI+1)
            const posY= elementSize * (rowI+1)

            if (col=='O'){
                if (!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX
                    playerPosition.y = posY
                    console.log({playerPosition})
                } 
            }else if (col=='I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X'){
                enemyPositions.push({
                    x:posX,
                    y:posY,
                })
            }

            game.fillText(emoji, posX, posY);
        })
        
    });

    movePlayer()

    /*//for (let row=1; row<=10; row++){
        //game.fillText(emojis['X'], elementSize, elementSize*i)
        for (let col=1; col<=10; col++){
            game.fillText(emojis['X'], elementSize*col, elementSize*row)
    
        }
    }*/

}

function movePlayer(){
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;


    if (giftCollision){
        levelWin()
    }

    const enemyCollision = enemyPositions.find( enemy => {
        const enemyCollisionX = enemy.x.toFixed(3)==playerPosition.x.toFixed(3)
        const enemyCollisionY = enemy.y.toFixed(3)==playerPosition.y.toFixed(3)
        return  enemyCollisionX && enemyCollisionY
    })

    if (enemyCollision){
        levelFail()
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)

}

function levelWin(){
    console.log('subiste nivel')
    level++
    startGame()
}

function levelFail(){

    console.log('chocaste perro')
    lives--;


    console.log(lives)

    if (lives <= 0) {
        level=0
        lives=3
        timeStart=undefined
    }

    playerPosition.x = undefined
    playerPosition.y= undefined
    startGame()

}

function gameWin(){
    console.log('ganaste perrito')
    clearInterval(timeInterval)

    const recordTime = localStorage.getItem('record_time')
    const playerTime = Date.now()- timeStart

    if (recordTime){
        if (recordTime >= playerTime){
            localStorage.setItem('record_time', playerTime)
            pResult.innerHTML= 'superaste perrito'
        } else {
            pResult.innerHTML='no lograste perrito'
        }
    } else{
        localStorage.setItem('record_time', playerTime)
        pResult.innerHTML='trata de superar el tiempo'
    }
    console.log({recordTime, playerTime})
}

function showLives(){
    const heartArray= Array(lives).fill(emojis['HEART'])
    spanLives.innerHTML = ""
    heartArray.forEach(heart => spanLives.append(heart));

}

function showTime(){
    spanTime.innerHTML = Date.now() - timeStart
}

function showRecord(){
    spanRecord.innerHTML=localStorage.getItem('record_time')
}

window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click',moveUp)
btnDown.addEventListener('click', moveDown)
btnRight.addEventListener('click', moveRight)
btnLeft.addEventListener('click', moveLeft)

function moveByKeys(){
    if (event.key=='ArrowUp'){
        moveUp()
    } else if (event.key == 'ArrowDown'){
        moveDown()
    } else if (event.key == 'ArrowRight'){
        moveRight()
    } else if (event.key == 'ArrowLeft'){
        moveLeft()
    }

}
function moveUp(){
    if ((playerPosition.y - elementSize) < elementSize) {
        console.log('out')
    } else {
        console.log('mover arriba')
        playerPosition.y -= elementSize
        startGame()
    }

    
}
function moveDown(){
    if ((playerPosition.y + elementSize) >  canvasSize) {
        console.log('out')
    } else {
        console.log('mover abajo')
        playerPosition.y += elementSize
        startGame()
    }
    
}
function moveRight(){
    if ((playerPosition.x + elementSize) > canvasSize) {
        console.log('out')
    } else {
        console.log('mover derecha')
        playerPosition.x += elementSize
        startGame()
    }
    
}
function moveLeft(){
    if ((playerPosition.x - elementSize) < elementSize) {
        console.log('out')
    } else {
        console.log('mover izquierda')
        playerPosition.x -= elementSize
        startGame()
    }

    
}