let playerScore = 0;
let computerScore = 0;

const choices = ["Sten", "papper", "sax"];

function makeChoice(playerChoice, playerName) {

    if (playerName === "") {
        document.getElementById("popup").innerText = "Skriv in ditt namn först!";
        return;
    }
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    let result;
    if (playerChoice === computerChoice) {
        result = "Lika!";
    } else if (
        (playerChoice === "Sten" && computerChoice === "sax") ||
        (playerChoice === "papper" && computerChoice === "Sten") ||
        (playerChoice === "sax" && computerChoice === "papper")
    ) {
        result = "Du vann denna rond!";
        playerScore++;
    } else {
        result = "Du förlorade denna rond!";
        computerScore++;
    }


    document.getElementById("result").innerText = `${playerName}, du valde ${playerChoice} och datorn valde ${computerChoice}. ${result}`;

    updateScores();
    setTimeout(GameEnd(playerName), 200);
}

function updateScores() {
    document.getElementById('scores').innerText = `Antal vinster: ${playerScore}`;
}

function GameEnd(playerName) {
    const rockButton = document.getElementById("rock-button");
    const paperButton = document.getElementById("paper-button");
    const scissorsButton = document.getElementById("scissors-button");

    if (computerScore === 1) {
        document.getElementById("popup").innerText = `Nu vann datorn, men du får gärna försöka igen!`
        rockButton.setAttribute("disabled", true);
        paperButton.setAttribute("disabled", true);
        scissorsButton.setAttribute("disabled", true);
        postToFirebase(playerName, playerScore);
    }
}

const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", function () {
    resetGame();
});

function resetGame() {

    const rockButton = document.getElementById("rock-button");
    const paperButton = document.getElementById("paper-button");
    const scissorsButton = document.getElementById("scissors-button");

    playerScore = 0;
    computerScore = 0;
    updateScores();
    var elementsToClear = ["popup", "scores", "result", "player-name"];
    for (var i = 0; i < elementsToClear.length; i++) {
        document.getElementById(elementsToClear[i]).innerHTML = "";
    }
    rockButton.removeAttribute("disabled");
    paperButton.removeAttribute("disabled");
    scissorsButton.removeAttribute("disabled");
}

async function postToFirebase(playerName, playerScore) {
    const baseUrl = 'https://rock-paper-scissors-4beb1-default-rtdb.europe-west1.firebasedatabase.app/topPlayers/place';
    const scores = [];

    for (let i = 1; i <= 5; i++) {
        const url = `${baseUrl}${i}.json`;
        const response = await fetch(url);
        const data = await response.json();
        const score = parseInt(data.score);

        if (!isNaN(score)) {
          scores.push({ name: data.name, score: score });
        }
      }

    scores.push({ name: playerName, score: parseInt(playerScore) });

    scores.sort((a, b) => b.score - a.score);

    for (let i = 0; i < 5; i++) {
      const url = `${baseUrl}${i + 1}.json`;
      const newScore = { 
        "name": `${scores[i].name}`, 
        "score":`${scores[i].score}`
      }
      document.getElementById(`nr${i}`).innerText = `${i+1}: ` + newScore.name +" score "+ newScore.score; 
      const options = {
        method: 'PATCH',
        body: JSON.stringify(newScore),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      };
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
    }
  }


export { makeChoice, updateScores, postToFirebase };