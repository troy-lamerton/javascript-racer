//constants
var SPEED = 12;

//players
var player1 = document.getElementById('player1');
var player2 = document.getElementById('player2');
var players = [{style:player1.style, position:0}, {style: player2.style, position:0}];

//increases margin-left of the player element
var moves = function moves (playerNum) {
  players[playerNum].position += SPEED;
  players[playerNum].style["left"] = players[playerNum].position + "%";
};