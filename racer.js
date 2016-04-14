//constants
var SPEED = 5;

//players
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
//ensure position = races.css .player{left: [% value]} 
var players = [{style:player1.style, position:-9}, {style: player2.style, position:-9}];
//var playersBackup = JSON.parse(JSON.stringify(players)); //clones players array


//move a player element to the right
var movePlayer = function movePlayer (playerNum) {
  players[playerNum].position += SPEED;
  players[playerNum].style["margin-left"] = players[playerNum].position + "%";
};

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keydown', keyDownHandler, false)
})

function keyDownHandler (e) {
  //R key is 82
  if (e.keyCode == 82) {
    restartGame();
    return;
  }
  //Q key is 81, P key is 80
  if (e.keyCode == 81) {
    movePlayer(0);
  }
  else if (e.keyCode == 80) {
    movePlayer(1);
  }
}

function restartGame () {
  location.reload();
}