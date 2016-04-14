//constants
var SPEED = 5;

//players
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
var players = [{style:player1.style, position:0}, {style: player2.style, position:0}];

//increases margin-left of the player element
var movePlayer = function movePlayer (playerNum) {
  players[playerNum].position += SPEED;
  players[playerNum].style["left"] = players[playerNum].position + "%";
};

document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('keydown', keyDownHandler, false)
})

function keyDownHandler (e) {
  //P key
  if (e.keyCode == 81) {
    movePlayer(0);
  }
  else if (e.keyCode == 80) {
    movePlayer(1);
  }
}