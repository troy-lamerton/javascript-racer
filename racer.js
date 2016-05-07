//constants
var SPEED = 3.9;
var FINISH = 80; //finish = .finish{left} - .player{width} - finish{border-left}

//players
var player1 = $('#player1');
var player2 = $('#player2');
//ready indicator cells
var ready1 = document.getElementById('ready1');
var ready2 = document.getElementById('ready2');
//message text
var message = $('#message');

/*  Players object */
//  An array of two player objects, stored at players[0] and [1]
/*  Player object */
/*  html: | DOM object representing this player on the page
    position: [y, x] | coordinate of player location on grid
    ready: true OR false | true after the player hits key
    direction: true OR false | false: player is pointing horizontally,
                        true: player is pointing vertically,
                        used for visually displaying the player 
    startingPosition: [y, x] | the cell this player always starts at in the maze */
var players = [
  {html: player1, position: [0, 0], direction: true, ready: false, startingPosition: [0, 0]},
  {html: player2, position: [6, 6], direction: true, ready: false, startingPosition: [6, 6]}
  // position: [row, cell] (essentially y, x)
];

/*  Maze object */
/*  [ [<cell>,<cell>, ... ], [<cell>,<cell>, ... ], ... ] */
/* Maze notation 
 Cells have four boolean values defining their borders.
    Defined in this order: Top, Right, Bottom, Left */
var maze = [ //The below maze is 7x7 in size, and is simply a square. The top left cell is at [0, 0].
    [[true,false,false,true], [true,false,false,false], [true,false,false,false], [true,false,false,false], [true,false,false,false], [true,false,false,false], [true,true,false,false]],
    [[false,false,false,true], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,true,false,false]],
    [[false,false,false,true], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,true,false,false]],
    [[false,false,false,true], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,true,false,false]],
    [[false,false,false,true], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,true,false,false]],
    [[false,false,false,true], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,false,false,false], [false,true,false,false]],
    [[false,false,true,true], [false,false,true,false], [false,false,true,false], [false,false,true,false], [false,false,true,false], [false,false,true,false], [false,true,true,false]]
];

var winCell = [3,3] //location of the winning square, can be directly compared with player position

/*  Game functions */
//    In function parameters, (player) means 
//    the player object e.g. players[1] is player 2.
//    (playerIndex) means the players index, e.g. 0 refers to player 1 in the players array
/*  
    drawMaze (): creates an HTML table and draws the currently stored
      maze
    drawPlayers (): remove the players and adds the <div>s to their current position 
    canMove (player, direction): true or false | 
      checks if a given player is not blocked and 
      can move in the given direction
    move (playerIndex, direction): true or false | moves the player in the direction given then draws the players
      true: player has won
      false: player has not won, game continues
    hasWon (player): true or false | checks that the player has won.
    announceWinner (playerIndex): | displays that player has won, 
      pauses the game and shows the restart button
    newMaze (x, y)<-- See newMaze.js (code is not my own)
    */

function drawMaze () {
  var gameDiv = $("#maze");
  var rowString = "";
  var tableString = "<table><tbody>";
  // draw rows of cells
  maze.forEach(function (rowElement, row, array) {
    // tableString += "<tr>");
    rowString += "<tr>";
    maze[row].forEach(function (cellElement, cell, array) {
      //for each cell in the row
      var cellClasses = "";
      //add a border for each wall exists
      
      if (maze[row][cell][0]) {
        cellClasses += "top ";
      }
      if (maze[row][cell][1]) {
        cellClasses += "right ";
      }
      if (maze[row][cell][2]) {
        cellClasses += "bottom ";
      }
      if (maze[row][cell][3]) {
        cellClasses += "left ";
      }
      //check if this is the winning cell
      if (isWinCell([row,cell])) {
        //apply the winning cell class
        cellClasses += "finish ";
      }
      //remove the trailing space character
      cellClasses = cellClasses.slice(0, cellClasses.length-1)
      var cellId = "cell_" + row + "_" + cell; // cell_0_0
      rowString += '<td class="' + cellClasses + '" id="' + cellId + '"></td>';
    });
    // tableString += "</tr>");
    rowString += "</tr>";
    tableString += rowString;
    rowString = "";
  });

  tableString += "</tbody></table>";
  gameDiv.html(tableString);

  drawPlayers(); //Update the players
}

/* drawPlayers ():
 removes the player <div>s and adds the <div>s to their current position */
function drawPlayers () {
  $("#one").remove();
  $("#two").remove();

  var playerOneDiv = '<div class="player one" id="one"></div>';
  var playerTwoDiv = '<div class="player two" id="two"></div>';

  var rowPOne = players[0].position[0];
  var cellPOne = players[0].position[1];
  var rowPTwo = players[1].position[0];
  var cellPTwo = players[1].position[1];
  $("#cell_" + rowPOne + "_" + cellPOne).html(playerOneDiv);
  $("#cell_" + rowPTwo + "_" + cellPTwo).html(playerTwoDiv);

  spotlightMap(players[0].position);
  spotlightMap(players[1].position);
}

/* Display the map around a position */
function spotlightMap (position) {
  //light up the cells around the position
  //start from 2 cells above and to the left of the player. row-2, cell-2
  //finish at 2 cells below and 2 to the right. row+2, cell+2
  for (var row = position[0]-2; row < position[0]+2; row++) {
    for (var cell = position[1]-2; cell < position[1]+2; cell++) {
      if (maze[row] != undefined && maze[row][cell] != undefined) {
        //spotlight this cell if its not the winCell
        if (!isWinCell([row, cell])) {
          $("#cell_" + row + "_" + cell).addClass("shown");
        }
      }
    }
  }
}

/*  canMove (player, direction): true or false | 
      checks if a given player is not blocked and 
      can move in the direction specified 
      NOTE: Assumes that the maze is enclosed in a square, i.e. the outer cells have walls to the outside. */
function canMove (player, direction) {
  var wallIndex = -1; //Index of the wall that the player is trying to pass through
  //0 top, 1 right, 2 bottom, 3 left
  
  if (direction === "up") {
    wallIndex = 0;
  }
  else if (direction === "right") {
    wallIndex = 1;
  }
  else if (direction === "down") {
    wallIndex = 2;
  }
  else if (direction === "left") {
    wallIndex = 3;
  }
  // check the position in the maze that the player is at for a wall at wallIndex
  if (maze[ player.position[0] ][ player.position[1] ][wallIndex]) {
    //there is a wall in the way of moving in this direction, can't move in that direction
    return false;
  }
  else {
    //no wall, you can move here!
    return true;
  }
}

/* move (playerIndex, direction): true or false | moves the player in the direction given then draws the players */
function move (playerIndex, direction) {
  if (canMove(players[playerIndex], direction)) {
    //add or subtract one from, an item in the player's position array
    if (direction === "up") {
      //add one to y
      players[playerIndex].position[0]--;
    }
    else if (direction === "right") {
      //add one to x
      players[playerIndex].position[1]++;
    }
    else if (direction === "down") {
      //sub one from y
      players[playerIndex].position[0]++;
    }
    else if (direction === "left") {
      //sub one from x
      players[playerIndex].position[1]--;
    }
    else {
      throw new Error("Unexpected direction string given to player moving function!");
    }

    drawPlayers();
    if( isWinCell(players[playerIndex].position) ){
      announceWinner(playerIndex);
    }
  }
}


/*hasWon (player): true or false | checks that the player has won.*/
function isWinCell (position) {
  if (position[0] === winCell[0] && position[1] === winCell[1]) return true;
  else return false;
}

/*announceWinner (playerIndex): | displays that player has won, 
      pauses the game and shows the restart button*/
function announceWinner (playerIndex) {
  switch (playerIndex) {
    case 0:
      message.html("Player one has won!");
      break;
    case 1:
      message.html("Player two has won!");
      break;
  }
}

//states
var gameState = "readyUp"; //readyUp, playing, win1, win2

/*  move (player, direction): true or false |
      Moves the player from its position in the direction given
      true: player has won
      false: player has not won, game continues */

/* Assign keyup handler once page is fully loaded*/
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keydown', keyDownHandler, false)
});
/* Keycodes map https://shikargar.files.wordpress.com/2010/10/keycodes.png */
function keyDownHandler (e) {
  //R key is 82
  if (e.keyCode == 82) {
    restartGame();
    return;
  } 

  /* Player one movement */
  if (e.keyCode == 87) {
    move(0, "up");
  }
  else if (e.keyCode == 68) {
    move(0, "right");
  }
  else if (e.keyCode == 83) {
    move(0, "down");
  }
  else if (e.keyCode == 65) {
    move(0, "left");
  }

  /* Player two movement */
  if (e.keyCode == 38) {
    move(1, "up");
  }
  else if (e.keyCode == 39) {
    move(1, "right");
  }
  else if (e.keyCode == 40) {
    move(1, "down");
  }
  else if (e.keyCode == 37) {
    move(1, "left");
  }

  else if (e.keyCode == 32 && gameState === "readyUp") {
    //Space is 32
    startGame();
  }
};

function startGame () {
  if (allPlayersReady()) {
    gameState = "playing"; //movement events are accepted now
    message.html("Go! Go! Go!");
  }
};

/*________________ RUN GAME _____________________*/

maze = newMaze(7,7);
//Winning square is at the center of the maze
winCell = [Math.floor(maze.length/2), Math.floor(maze[0].length/2)]
drawMaze();
drawPlayers();

/*_______________________________________________*/

function gameWon (playerIndex) {
  gameState = "win" + (playerIndex + 1); //win1 or win2
  message.innerHTML = "Player " + (playerIndex+1) + " wins the race!";
  //dim the other player's spotlight
  dimOtherTrack(playerIndex);
  //show restart game button
  $('#restart').className = "show";
};
/* Dims a player's track - visual only, doesn't affect movement */
function dimOtherTrack (playerIndex) {
  if (playerIndex === 0) {
    //dim player 2 track, emphasizing winning track
    track2.className += " dimmed";
  }
  else {
    //dim player 1 track, emphasizing winning track
    track1.className += " dimmed";
  };
};

function restartGame () {
  location.reload();
};