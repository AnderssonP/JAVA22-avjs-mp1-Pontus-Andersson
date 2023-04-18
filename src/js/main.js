import { makeChoice, updateScores, postToFirebase } from "./game.js";

let playerName = "";

const formBtn = document.querySelector("button")
formBtn.addEventListener("click", event => {
  event.preventDefault();
  playerName = document.getElementById("player-name").value;
  updateScores();
  document.getElementById("popup").innerText = "";
});

const rockButton = document.getElementById("rock-button");
rockButton.addEventListener("click", event=> {
  event.preventDefault();
  makeChoice("Sten", playerName);
});

const paperButton = document.getElementById("paper-button");
paperButton.addEventListener("click", event => {
  event.preventDefault();
  makeChoice("papper", playerName);
});

const scissorsButton = document.getElementById("scissors-button");
scissorsButton.addEventListener("click", event => {
  event.preventDefault();
  makeChoice("sax", playerName);
});

postToFirebase();