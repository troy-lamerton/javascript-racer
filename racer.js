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
var message = document.getElementById('message');

/*  Players object */
//  An array of two player objects, stored at players[0] and [1]
/*  Player object */
/*  html: | DOM object representing this player on the page
    position: [x, y] | coordinate of player location on grid
    ready: true OR false | true after the player hits key
    direction: true OR false | false: player is pointing horizontally,
                        true: player is pointing vertically,
                        used for visually displaying the player */
var players = [
  {html: player1, position: [-1, -1], direction: true, ready: false},
  {html: player2, position: [-1, -1], direction: true, ready: false}
  // position: [row, cell] (essentially y, x)
];

/*  Maze object */
/*  [ [<cell>,<cell>, ... ], [<cell>,<cell>, ... ], ... ] */
/* Maze notation */
/* There are 14 possible cell shapes.
/* Cells have four boolean values defining their borders.
    Top, Right, Bottom, Left
    This is the same as CSS. */
var maze = [ //The below maze is 7x7 in size, and is simply a square. The top left cell is at [0, 0].
    [[true,false,false,true], [true,false,false,false], [true,false,false,false], [true,false,false,false], [true,false,false,false], [true,false,false,false], [true,true,false,false]],
    [[false,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,true,false,false]],
    [[false,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,true,false,false]],
    [[false,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true],true [true,true,false,false]],
    [[false,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,true,false,false]],
    [[false,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,false,false,true], [true,true,false,false]],
    [[false,false,true,true], [false,false,true,false], [false,false,true,false], [false,false,true,false], [false,false,true,false], [false,false,true,false], [false,true,true,false]]
];

var winCell = [3,3] //location of the winning square, can be directly compared with player position

/*  Game functions */
//    In function parameters, (player) means 
//    the player object e.g. players[1] is player 2.
//    (playerIndex) means the players index, e.g. 0 refers to player 1 in the player array
/*  move (player, direction): true or false |
      true: player has won
      false: player has not won, game continues
    canMove (player, direction): true or false | 
      checks if a given player is not blocked and 
      can move in the given direction
    hasWon (player): | displays that player has won,
      pauses the game and shows the restart button
    announceWinner (player): | displays that player has won, 
      pauses the game and shows the restart button
    newMap (filePath): true if successfully loads | loads a new map from
      given filePath, sets the player starting positions 
      and centre win block position
    drawMaze (): creates an HTML table and draws the currently stored
      maze */
function drawMaze () {
  var gameDiv = $("#game");
  gameDiv.prepend("<table><tbody>");

  // draw rows of cells
  maze.forEach(function (rowElement, row) {
    maze[index].forEach(function (cellElement, cell) {
      //for each cell in the row
      var borderClasses = "";
      //add a border for each wall exists
      if (maze[row][cell][0]) {
        borderClasses += "top ";
      }
      if (maze[row][cell][1]) {
        borderClasses += "right ";
      }
      if (maze[row][cell][2]) {
        borderClasses += "bottom ";
      }
      if (maze[row][cell][3]) {
        borderClasses += "left ";
      }

      gameDiv.append('<td class="' + borderClasses + '"></td>');
    });
  });

  gameDiv.append("</tbody></table>");
}

drawMaze();
//states
var gameState = "readyUp"; //readyUp, playing, win1, win2

/*  canMove (player, direction): true or false | 
      checks if a given player is not blocked and 
      can move in the given direction */
function canMove (player, direction) {
  var moveToCell = [];
  var wallIndex = -1; //Index of the wall in moveToCell that the player trying to enter
  //0 top, 1 right, 2 bottom, 3 left

  if (direction === "up") {
    moveToCell = maze[player.position[0]+1, player.position[1]]; //one row above the player
    wallIndex = 2;
  }
  else if (direction === "right") {
    moveToCell = maze[player.position[0], player.position[1]+1];
    wallIndex = 3;
  }
  else if (direction === "down") {
    moveToCell = maze[player.position[0]-1, player.position[1]];
    wallIndex = 0;
  }
  else if (direction === "left") {
    moveToCell = maze[player.position[0], player.position[1]-1];
    wallIndex = 1;
  }
  if (moveToCell[wallIndex]) {
    //there is a wall in the wall, can't move here
    return false;
  }
  else {
    //no wall, you can move here!
    return true;
  }
}
/*  move (player, direction): true or false |
      Moves the player from its position in the direction given
      true: player has won
      false: player has not won, game continues */
function move (player, direction) {
  if (canMove(player,direction)) {

  }
  else {
    return false;
  }

}

/* Assign keyup handler once page is fully loaded*/
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keyup', keyUpHandler, false)
});
/* Keycodes map https://shikargar.files.wordpress.com/2010/10/keycodes.png */
function keyUpHandler (e) {
  //R key is 82
  if (e.keyCode == 82) {
    restartGame();
    return;
  } /* Player one */
  if (e.keyCode == 81) {
    //Q key is 81
    if (gameState === "readyUp") {
      readyUp(0);
    }
    else if (gameState === "playing"){
      movePlayer(0);
    }
  } /* Player two */
  else if (e.keyCode == 80) {
    //P key is 80
    if (gameState === "readyUp") {
      readyUp(1);
    }
    else if (gameState === "playing"){
      movePlayer(1);
    }
  }
  else if (e.keyCode == 32 && gameState === "readyUp") {
    //Space is 32
    startGame();
  }
};

function readyUp (playerIndex) {
  if (playerIndex === 0) {
    players[0].ready = true //this player is ready
    //remove dimmer from player's track
    track1.className = track1.className.replace( /(?:^|\s)dimmed(?!\S)/g , '' );
    ready1.className = "ready";
    ready1.innerHTML = "Ready!";
  }
  else if (playerIndex === 1) {
    players[1].ready = true //this player is ready
    //remove dimmer from player's track
    track2.className = track2.className.replace( /(?:^|\s)dimmed(?!\S)/g , '' );
    ready2.className = "ready";
    ready2.innerHTML = "Ready!";
  };

  if ( allPlayersReady() ) {
    message.innerHTML = "Press [Space] to race!";
  }
};

function startGame () {
  console.log('allPlayersReady: ' + allPlayersReady());
  if (allPlayersReady()) {
    gameState = "playing"; //movement events are accepted now
    message.innerHTML = "Go! Go! Go!";
  }
  else {
    alert('All players must ready up first!');
  };
};

function allPlayersReady () {
  var numReady = 0;
  for (var i = 0; i < players.length; i++) {
    //check player is ready
    if (players[i].ready === true){
      numReady++;
    }
    else {
      break;
    };
  };
  return (numReady === players.length);
};

function gameWon (playerIndex) {
  gameState = "win" + (playerIndex + 1); //win1 or win2
  message.innerHTML = "Player " + (playerIndex+1) + " wins the race!";
  //dim the other player's spotlight
  dimOtherTrack(playerIndex);
  //show restart game button
  document.getElementById('restart').className = "show";
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