const startBtn = document.getElementById("startBtn");
const addCardBtn = document.getElementById("addCardBtn");
const standBtn = document.getElementById("standBtn");
const abandonBtn = document.getElementById("abandonBtn");
const playerPointsEl = document.getElementById("playerPoints");
const dealerPointsEl = document.getElementById("dealerPoints");
const resultEl = document.getElementById("result");
const playerCardsEl = document.getElementById("playerCards");
const dealerCardsEl = document.getElementById("dealerCards");
const musicaFondo = document.getElementById("musicaFondo");

musicaFondo.volume = 0.3;

function playButtonSound(soundFile) {
  const audio = new Audio(soundFile);
  audio.volume = 0.5;
  audio.play().catch(err => console.log("Error al reproducir sonido:", err));
}

let musicaIniciada = false;

document.addEventListener("click", function reproducirMusica() {
  if (!musicaIniciada) {
    musicaFondo.play()
      .then(() => {
        console.log("✅ Música reproduciendo correctamente");
        musicaIniciada = true;
      })
      .catch(err => {
        console.error("❌ Error al reproducir música:", err);
        alert("No se pudo reproducir el audio. Verifica que el archivo exista en: audio/fondo1.mp3");
      });
    document.removeEventListener("click", reproducirMusica);
  }
}, { once: true });

let playerPoints = 0;
let dealerPoints = 0;
let gameActive = false;
let deck = [];

// Crear mazo de 52 cartas
function createDeck() {
  deck = [];
  const suits = ['C', 'D', 'H', 'S'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

  for (let suit of suits) {
    for (let rank of ranks) {
      let valor = rank === 'A' ? 11 : (['J','Q','K'].includes(rank) ? 10 : parseInt(rank));
      deck.push({
        valor,
        img: `img/cartas/cards/${rank}${suit}.png`,
        name: `${rank}${suit}`
      });
    }
  }
  deck.sort(() => Math.random() - 0.5);
}

function drawCard(targetDiv) {
  if(deck.length === 0) createDeck();
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

  
  playButtonSound("musica.mp3/click mouse.mp3");

 
  musicaFondo.pause();
  musicaFondo.currentTime = 0;

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

startBtn.onclick = startGame;

addCardBtn.onclick = () => {
  if(!gameActive) return;
  playButtonSound("musica.mp3/click mouse.mp3");
  playerPoints += drawCard(playerCardsEl);
  updateUI();
  if(playerPoints > 21) endGame("lose");
};

standBtn.onclick = () => {
  if(!gameActive) return;
  playButtonSound("musica.mp3/click mouse.mp3");
  while(dealerPoints < 17) dealerPoints += drawCard(dealerCardsEl);
  updateUI();
  checkResult();
};

abandonBtn.onclick = () => {
  if(!gameActive) return;
  playButtonSound("audio/audio/click.audio.mp3");
  endGame("abandon");
};

function updateUI() {
  playerPointsEl.textContent = playerPoints;
  dealerPointsEl.textContent = dealerPoints;
}

function checkResult() {
  if(playerPoints > 21) return endGame("lose");
  if(dealerPoints > 21 || playerPoints > dealerPoints) endGame("win");
  else if(playerPoints < dealerPoints) endGame("lose");
  else endGame("draw");
}

function endGame(status) {
  gameActive = false;
  addCardBtn.disabled = true;
  standBtn.disabled = true;
  abandonBtn.disabled = true;

  document.body.classList.add("flash");
  setTimeout(() => document.body.classList.remove("flash"), 1800);

 
  if (musicaIniciada) {
    musicaFondo.play().catch(err => console.log("Error al reanudar música:", err));
  }

  if(status === "win") {
    resultEl.innerHTML = `<span class="green">🎉 ¡Ganaste! Continúa el juego...</span>`;
  } else if(status === "lose") {
    const color = randomColor();
    resultEl.innerHTML = `<span class="${color}">💀 Perdiste... ${color==='red' ? '¡Balazo!' : 'Te salvaste por poco...'}</span>`;
  } else if(status === "abandon") {
    resultEl.innerHTML = `<span class="red">Te rendiste. Fin del juego.</span>`;
  } else {
    resultEl.innerHTML = `<span>Empate 🤝</span>`;
  }
}

function playSound(audioId) {
  const audio = document.getElementById(audioId);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Error al reproducir audio:', e));
  }
}

const allButtons = document.querySelectorAll('button');
allButtons.forEach(button => {
  button.addEventListener('click', function() {
    playSound('audioClick');
  });
});
