const emojis = ['🍕','🍔','🍟','🌮','🍩','🍉','🍇','🍓'];
let cards = [...emojis, ...emojis];
let flippedCards = [];
let matchedCards = 0;
let moves = 0;
let time = 0;
let timerStarted = false;
let timerInterval;

const board = document.getElementById('gameBoard');
const timeDisplay = document.getElementById('time');
const movesDisplay = document.getElementById('moves');
const bestScoreDisplay = document.getElementById('best-score');
const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');
const winSound = document.getElementById('winSound');

let bestScore = localStorage.getItem("bestScore");
if (bestScore) bestScoreDisplay.textContent = bestScore;

function startTimer() {
  timerInterval = setInterval(() => {
    time++;
    timeDisplay.textContent = time;
  }, 1000);
}

function setupBoard() {
  board.innerHTML = "";
  cards.sort(() => 0.5 - Math.random());
  cards.forEach(emoji => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.innerHTML = "❓";
    card.addEventListener('click', () => flipCard(card));
    board.appendChild(card);
  });
}

function flipCard(card) {
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }
  if (flippedCards.length === 2 || card.classList.contains('flipped')) return;

  flipSound.play();
  card.classList.add('flipped');
  card.innerHTML = card.dataset.emoji;
  flippedCards.push(card);
  moves++;
  movesDisplay.textContent = moves;

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.dataset.emoji === second.dataset.emoji) {
      matchSound.play();
      first.classList.add('matched');
      second.classList.add('matched');
      matchedCards += 2;
      flippedCards = [];

      if (matchedCards === cards.length) {
        clearInterval(timerInterval);
        winSound.play();
        setTimeout(() => {
          const finalScore = time + moves;
          const saved = localStorage.getItem("bestScore");
          if (!saved || finalScore < saved) {
            localStorage.setItem("bestScore", finalScore);
            bestScoreDisplay.textContent = finalScore;
            alert(`🎉 New Best Score! Time: ${time}s, Moves: ${moves}`);
          } else {
            alert(`🎉 You matched all cards! Time: ${time}s, Moves: ${moves}`);
          }
        }, 500);
      }
    } else {
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        first.innerHTML = "❓";
        second.innerHTML = "❓";
        flippedCards = [];
      }, 1000);
    }
  }
}

document.getElementById('restart').addEventListener('click', () => {
  location.reload();
});

setupBoard();
