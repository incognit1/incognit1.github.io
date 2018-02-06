//settings
var rows = 15,             // Height of map
    columns = 26,          // Width of map
    increment = 1,         // Growth of snake
    intervalTime = 110;    // Speed game

var currentX = 1,                 // Сurrent X-coordinate
    currentY = 1,                 // Сurrent Y-coordinate
    direction,                    // 37 - left, 38 - up, 39 - right, 40 - down
    tail,                         // Length of tail
    route,                        // It is necessary for quick-press protection
    gameStart = false,
    gameOver = false,
    arrSnakeX = [currentX],       // Array of X-coordinates of the snake
    arrSnakeY = [currentY],       // Array of Y-coordinates of the snake
    interval,                     // game interval
    intervalMushroom,
    fruitX,
    fruitY,
    fruitType,
    mushroomX,
    mushroomY,
    headDir = '',                 // direction of head
    scope = 0,
    record = localStorage.getItem('record');

createMap();
var table = document.getElementsByTagName('table')[0],
    output = document.getElementsByClassName('scope')[0],
    outRec = document.getElementsByClassName('rec')[0],
    newGame = document.getElementsByClassName('newGame')[0],
    menu = document.getElementsByClassName('darkness')[0];


init();
start();



// Initialization of game objects
function init() {
  clean();
  scope = 0;
  output.style.display = 'none';
  // Creating a SNAKE
  currentX = 1;
  currentY = 1;
  tail = 3;
  route = 0;
  table.rows[currentY].cells[currentX].classList.add('snake');
  arrSnakeX = [currentX];
  arrSnakeY = [currentY];
  createWall();
  createWall();
  createWall();
  createWall();
  createFruit();
}


// Start game
function start(){
  interval = setInterval(function() {
    if (gameStart && !gameOver) {
      update();
    }

    else if(gameOver) {
      menu.style.display = 'block';
      gameOver = true;
      gameStart = false;
    }

  }, intervalTime);

  intervalMushroom = setInterval(function() {
       if (gameStart && !gameOver) {
         createMushroom();
       }

  }, 15000);
}


// Creating a MAP
function createMap() {
  var map = document.createElement('table'),
      p = document.createElement('p'),
      div = document.createElement('div'),
      darkness = document.createElement('div'),
      main = document.createElement('div'),
      newGamebtn = document.createElement('button'),
      rec = document.createElement('p');
      loseP = document.createElement('p');

  for(var i = 0; i < rows; i++) {
    var row = document.createElement('tr');

    for(var j = 0; j < columns; j++) {
      var column = document.createElement('td');
      row.appendChild(column);
    }

    map.appendChild(row);
  }

  p.className = 'scope';
  rec.className = 'rec';
  darkness.className = 'darkness';
  div.className = 'wrapper';
  newGamebtn.className = 'newGame';

  newGamebtn.innerHTML = 'Новая игра';
  loseP.innerHTML = 'Вы проиграли';
  p.style.display = 'none';

  if (record) {
    rec.innerHTML = 'Рекорд: ' + record;
  }


  main.appendChild(div);

  darkness.appendChild(newGamebtn);
  darkness.appendChild(loseP);
  div.appendChild(darkness);
  div.appendChild(map);
  document.body.appendChild(main);
  document.body.appendChild(p);
  document.body.appendChild(rec);
}

// Creating a FRUIT
function createFruit() {

  // Check for positions with a wall and a snake
  do {
    fruitY = rand(0, rows - 1),
    fruitX = rand(0, columns - 1);
    fruitType = rand(0, 10);
  } while (table.rows[fruitY].cells[fruitX].getAttribute('class'));

  table.rows[fruitY].cells[fruitX].classList.add('fruit');
  table.rows[fruitY].cells[fruitX].style.backgroundImage = 'url(img/' + fruitType + '.png)';
}

function createMushroom() {
  if (mushroomY != undefined && mushroomX != undefined) {
    table.rows[mushroomY].cells[mushroomX].classList.remove('mushroom');
  }

  setTimeout(function() {
    do {
      mushroomY = rand(0, rows - 1);
      mushroomX = rand(0, columns - 1);
    } while (table.rows[mushroomY].cells[mushroomX].getAttribute('class'));

    table.rows[mushroomY].cells[mushroomX].classList.add('mushroom');
  }, 5000)

}

function createWall() {
  do {
    wallX = rand(0, columns - 2);
    wallY = rand(0, rows - 2);
  } while (table.rows[wallY].cells[wallX].classList.contains('snake') ||
          table.rows[wallY + 1].cells[wallX].classList.contains('snake') ||
          table.rows[wallY].cells[wallX + 1].classList.contains('snake') ||
          table.rows[wallY + 1].cells[wallX + 1].classList.contains('snake'));

  table.rows[wallY].cells[wallX].classList.add('wall');
  table.rows[wallY].cells[wallX+1].classList.add('wall');
  table.rows[wallY+1].cells[wallX+1].classList.add('wall');
  table.rows[wallY+1].cells[wallX].classList.add('wall');


}


window.addEventListener('keydown', function(e) {
    if(e.keyCode == 40 && route !== 38 || e.keyCode == 39  && route !== 37 || e.keyCode == 38  && route !== 40 || e.keyCode == 37  && route !== 39) {
      direction = e.keyCode;

      if(!gameStart) gameStart = true;
    }

}, false)

newGame.addEventListener('click', function(){
  menu.style.display = 'none';

  if (gameOver) {
    init();
    gameOver = false;
  }
}, false)

// Updates
function update() {
  if (direction == 40) { //down
    if (currentY < table.rows.length - 1) {
      currentY++;
      headDir = '0px 0px 10px 10px';
      move();
      route = 40;
    }
    else { gameOver = true; }
  }

  if (direction == 38) { // Top
    if (currentY > 0) {
      currentY--;
      headDir = '10px 10px 0px 0px';
      move();
      route = 38;
    }
    else { gameOver = true; }
  }

  if (direction == 39) { // Right
    if (currentX < table.rows[currentY].cells.length - 1) {
      currentX++;
      headDir = '0px 10px 10px 0px';
      move();
      route = 39;
    }
    else { gameOver = true; }
  }

  if (direction == 37) { // Left
    if (currentX > 0) {
      currentX--;
      headDir = '10px 0px 0px 10px';
      move();
      route = 37;
    }
    else { gameOver = true; }
  }

}

// Clear the tail
function cutTail() {
  var mustBeDeleted = arrSnakeY.length - tail; // количество элементов на удаление в зависимости от длины

  if(mustBeDeleted >= 1) {
      // Сreate an array of deleted elements X and Y
      var deletedX = arrSnakeX.splice(0, mustBeDeleted);
      var deletedY = arrSnakeY.splice(0, mustBeDeleted);

      // Clear the tail
      for(var i = 0; i < deletedX.length; i++) {
        table.rows[deletedY[i]].cells[deletedX[i]].classList.remove('snake');
      }
  }

}

// Move the snake, move
function move() {

  // Collision with yourself and with a wall
  if( table.rows[currentY].cells[currentX].classList.contains('snake') ||
      table.rows[currentY].cells[currentX].classList.contains('wall')) {
    gameOver = true;
  }

  // Collision with fruit
  else {
    // Snake on the fruit
    if (currentX == fruitX && currentY == fruitY) {
      tail += increment;
      table.rows[fruitY].cells[fruitX].style.backgroundImage = '';
      table.rows[fruitY].cells[fruitX].classList.remove('fruit');
      createFruit();

      // Scope and record
      scope += 3;
      if (scope > record || !record) {
        localStorage.setItem('record', scope);
        record = localStorage.getItem('record');

        outRec.innerHTML = 'Рекорд: ' + record;
      }
      output.style.display = 'block';

    }

    //
    else if( table.rows[currentY].cells[currentX].classList.contains('mushroom')) {
      tail = Math.round(tail/2);
      scope = Math.round(scope/2);
      table.rows[currentY].cells[currentX].classList.remove('mushroom');

    }
    output.innerHTML = 'Баллы: ' + scope;


    table.rows[currentY].cells[currentX].style.borderRadius = headDir;
    table.rows[currentY].cells[currentX].classList.add('snake');

    // Head direction
    table.rows[arrSnakeY[arrSnakeY.length-1]].cells[arrSnakeX[arrSnakeX.length-1]].style.borderRadius = '0px';

    arrSnakeY[arrSnakeY.length] = currentY;
    arrSnakeX[arrSnakeX.length] = currentX;

    cutTail();
  }
}

function rand( min, max ) {	// Generate a random integer
  if( max ) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
  else {
		return Math.floor(Math.random() * (min + 1));
	}
}

function clean() {
  for(var i = 0; i < rows; i++) {
    for(var j = 0; j < columns; j++) {
      table.rows[i].cells[j].classList.remove('wall');
      table.rows[i].cells[j].classList.remove('fruit');
      table.rows[i].cells[j].style.backgroundImage = '';
      table.rows[i].cells[j].style.borderRadius = '';
      table.rows[i].cells[j].classList.remove('snake');
      table.rows[i].cells[j].classList.remove('mushroom');
    }

  }
}
