//constants
var SPEED = 3.9;
var FINISH = 80; //finish = .finish{left} - .player{width} - finish{border-left}

//players
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
//tracks
var track1 = document.getElementById('track1');
var track2 = document.getElementById('track2');
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
    direction: 0 OR 1 | 0: player is pointing horizontally,
                        1: player is pointing vertically,
                        used for visually displaying the player */

/*  Maze object */
/*  importMaze (filePath): 2D-array of rows[cells] OR undefined
    rows: [ [<cell>,<cell>, ... ], [<cell>,<cell>, ... ], ... ] */

/*  Game functions */
//    In function parameters, (player) means 
//    the player object e.g. players[1] is player 2.
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
      and centre win block position */

//ensure position = racer.css .player{margin-left: [% value]} 
var players = [{style:player1.style, position:-9, ready: false}, 
{style: player2.style, position:-9, ready: false}];
//var playersBackup = JSON.parse(JSON.stringify(players)); //clones players array

//states
var gameState = "readyUp"; //readyUp, playing, win1, win2

/* Functions */
//move a player element to the right and check if they have won
function movePlayer (playerIndex) {
  players[playerIndex].position += SPEED;
  players[playerIndex].style["margin-left"] = players[playerIndex].position + "%";
  //has player won?
  if (players[playerIndex].position >= FINISH) {
    gameWon(playerIndex);
  }
};

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