//constants
var SPEED = 5;

//players
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
//tracks
var track1 = document.getElementById('track1');
var track2 = document.getElementById('track2');
//ready indicator cells
var ready1 = document.getElementById('ready1');
var ready2 = document.getElementById('ready2');

//ensure position = races.css .player{left: [% value]} 
var players = [{style:player1.style, position:-9, ready: false}, 
{style: player2.style, position:-9, ready: false}];
//var playersBackup = JSON.parse(JSON.stringify(players)); //clones players array

//states
var gameState = "readyUp"; //readyUp, playing, win1, win2

/* Functions */
//move a player element to the right
var movePlayer = function movePlayer (playerNum) {
  players[playerNum].position += SPEED;
  players[playerNum].style["margin-left"] = players[playerNum].position + "%";
};

/* Assign keyup handler */
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keyup', keyUpHandler, false)
});

function keyUpHandler (e) {
  //R key is 82
  if (e.keyCode == 82) {
    restartGame();
    return;
  }
  //Q key is 81, P key is 80
  if (e.keyCode == 81) {
    if (gameState === "readyUp") {
      players[0].ready = true //this player is ready
      track1.className = track1.className.replace( /(?:^|\s)dimmed(?!\S)/g , '' );
      ready1.className = "ready";
      ready1.innerHTML = "Ready!";
    }
    else if (gameState === "playing"){
      movePlayer(0);
    }
  } //Player two
  else if (e.keyCode == 80) {
    if (gameState === "readyUp") {
      players[1].ready = true //this player is ready
      track2.className = track2.className.replace( /(?:^|\s)dimmed(?!\S)/g , '' );
      ready2.className = "ready";
      ready2.innerHTML = "Ready!";
    }
    else if (gameState === "playing"){
      movePlayer(1);
    }
  }
  else if (e.keyCode == 32) {
    //space
    startGame();
  }
};

function readyUp (playerNum) {
  if (playerNum === 1) {

  }
  else if (playerNum === 2) {
    
  }
}
function startGame() {
  console.log('allplayRed: ' + allPlayersReady());
  if (allPlayersReady()) {
    gameState = "playing"; //movement events are accepted now
    //remove dimmer from game board
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
  return numReady === players.length;
};

function restartGame () {
  location.reload();
};