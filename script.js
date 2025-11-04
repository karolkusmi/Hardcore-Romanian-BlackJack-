import { mostrarModal } from './modal-script.js';

let startBtn, addCardBtn, standBtn, abandonBtn;
let playerPointsEl, dealerPointsEl, resultEl;
let playerCardsEl, dealerCardsEl;

let playerPoints = 0;
let dealerPoints = 0;
let gameActive = false;
let deck = [];


function initDOM() {
  startBtn = document.getElementById("startBtn");
  addCardBtn = document.getElementById("addCardBtn");
  standBtn = document.getElementById("standBtn");
  abandonBtn = document.getElementById("abandonBtn");
  playerPointsEl = document.getElementById("playerPoints");
  dealerPointsEl = document.getElementById("dealerPoints");
  resultEl = document.getElementById("result");
  playerCardsEl = document.getElementById("playerCards");
  dealerCardsEl = document.getElementById("dealerCards");
}


export function createDeck() {
  deck = [];
  const suits = ['C', 'D', 'H', 'S']; 
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  for (let suit of suits) {
    for (let rank of ranks) {
      let valor;
      if (rank === 'A') {
        valor = 11; 
      } else if (['J', 'Q', 'K'].includes(rank)) {
        valor = 10;
      } else {
        valor = parseInt(rank);
      }
      deck.push({ 
        valor, 
        img: `img/cartas/cards/${rank}${suit}.png`,
        name: `${rank}${suit}`
      });
    }
  }
  deck = deck.sort(() => Math.random() - 0.5);
  return deck; 
}


export function getDeck() {
  return deck;
}


function playSound(id) {
  const audio = document.getElementById(id);
  if (!audio) {
    console.warn('Audio element not found:', id);
    return;
  }

  
  try { audio.currentTime = 0; } catch (e) {}

  const p = audio.play();
  if (p !== undefined) {
    p.catch(err => {
      
      console.warn('Audio play prevented or failed for', id, err);
    });
  }
}

function drawCard(targetDiv) {
  if (deck.length === 0) createDeck();
  const card = deck.pop();
  const img = document.createElement("img");
  img.src = card.img;
  img.alt = card.name;
  img.style.setProperty("--angle", `${Math.random() * 10 - 5}deg`);
  targetDiv.appendChild(img);
  return card.valor;
}

const randomColor = () => (Math.random() < 0.5 ? "green" : "red");

function startGame() {
  gameActive = true;
  createDeck();
  playerPoints = dealerPoints = 0;
  playerCardsEl.innerHTML = "";
  dealerCardsEl.innerHTML = "";
  resultEl.textContent = "";
  resultEl.className = "";
  
  playerPoints += drawCard(playerCardsEl);
  playerPoints += drawCard(playerCardsEl);
  dealerPoints += drawCard(dealerCardsEl);
  dealerPoints += drawCard(dealerCardsEl);
  updateUI();

  addCardBtn.disabled = false;
  standBtn.disabled = false;
  abandonBtn.disabled = false;
}


function setupEventListeners() {
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      playSound('audioClick');

      const bg = document.getElementById('musicaFondo');
      if (bg) {
        const p = bg.play();
        if (p !== undefined) p.catch(e => console.warn('Background music play prevented:', e));
      }

      startGame();
    });
  }

  if (addCardBtn) {
    addCardBtn.onclick = () => {
      if (!gameActive) return;
      playerPoints += drawCard(playerCardsEl);
      updateUI();
      if (playerPoints > 21) endGame("lose");
    };
  }

  if (standBtn) {
    standBtn.onclick = () => {
      if (!gameActive) return;
      while (dealerPoints < 17) dealerPoints += drawCard(dealerCardsEl);
      updateUI();
      checkResult();
    };
  }

  if (abandonBtn) {
    abandonBtn.onclick = () => {
      if (!gameActive) return;
      endGame("abandon");
    };
  }
}


if (typeof document !== 'undefined') {
  initDOM();
  setupEventListeners();
}

function updateUI() {
  playerPointsEl.textContent = playerPoints;
  dealerPointsEl.textContent = dealerPoints;
}

export function calculateGameResult(playerPts, dealerPts) {
  if (playerPts > 21) return "lose";
  if (dealerPts > 21 || playerPts > dealerPts) return "win";
  else if (playerPts < dealerPts) return "lose";
  else return "draw";
}

function checkResult() {
  if (playerPoints > 21) return endGame("lose");
  if (dealerPoints > 21 || playerPoints > dealerPoints) endGame("win");
  else if (playerPoints < dealerPoints) endGame("lose");
  else endGame("draw");
}

function endGame(status) {
  gameActive = false;
  addCardBtn.disabled = true;
  standBtn.disabled = true;
  abandonBtn.disabled = true;

  document.body.classList.add("flash");
  setTimeout(() => document.body.classList.remove("flash"), 1800);

  if (status === "win") {
    resultEl.innerHTML = `<span class="green">🎉 ¡Ganaste! Continúa el juego...</span>`;
  }else if (status === "lose") {
    const color = randomColor();
    resultEl.innerHTML = `<span class="${color}">💀 Perdiste... ${
      color === "red" ? "¡Balazo!" : "Te salvaste por poco... Sigues jugando"
    }</span>`;

  
    mostrarModal();

} else if (status === "abandon") {
    resultEl.innerHTML = `<span class="red">Te rendiste. Fin del juego.</span>`;
  } else {
    resultEl.innerHTML = `<span>Empate 🤝</span>`;
  }
}
