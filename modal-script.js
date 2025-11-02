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

let playerPoints = 0;
let dealerPoints = 0;
let gameActive = false;
let deck = [];
let musicaPausada = false;
let musicaIniciada = false;


const musicControlBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");

if (musicControlBtn && musicIcon) {
  musicControlBtn.addEventListener('click', function(e) {
    e.stopPropagation(); 
    
    console.log("🎵 Click en botón de música");
    console.log("Estado actual - pausada:", musicaPausada);
    console.log("Audio paused:", musicaFondo.paused);
    
    if (musicaPausada) {

      musicaFondo.play()
        .then(() => {
          console.log("✅ Música reanudada");
          musicIcon.textContent = "🔊";
          musicControlBtn.classList.add("playing");
          musicaPausada = false;
        })
        .catch(err => console.log("❌ Error al reproducir:", err));
    } else {
     
      musicaFondo.pause();
      console.log("⏸️ Música pausada");
      musicIcon.textContent = "🔇";
      musicControlBtn.classList.remove("playing");
      musicaPausada = true;
    }
  });
}

document.addEventListener("click", function reproducirMusica() {
  if (!musicaIniciada) {
    musicaFondo.play()
      .then(() => {
        console.log("✅ Música reproduciendo correctamente");
        musicaIniciada = true;
        if (musicControlBtn) {
          musicControlBtn.classList.add("playing");
        }
      })
      .catch(err => {
        console.error("❌ Error al reproducir música:", err);
      });
    document.removeEventListener("click", reproducirMusica);
  }
}, { once: true });

// ============ FUNCIONES DEL JUEGO ============
function playButtonSound(soundFile) {
  const audio = new Audio(soundFile);
  audio.volume = 0.5;
  audio.play().catch(err => console.log("Error al reproducir sonido:", err));
}
//pistola//

const mostrarPistolaYDisparar = () => {
    // Ocultar el contenido de la ruleta
    const modalContainer = document.querySelector('.modal-container');
    const ruletaContainer = document.querySelector('.ruleta-container');
    const modalText = document.querySelector('.modal-text');
    const modalP = document.querySelector('.modal-p');
    
    // Ocultar elementos de la ruleta
    ruletaContainer.style.display = 'none';
    modalText.style.display = 'none';
    modalP.style.display = 'none';
    
    // Crear y mostrar el GIF de la pistola
    const pistolaContainer = document.createElement('div');
    pistolaContainer.id = 'pistola-container';
    pistolaContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    `;
    
    const pistolaImg = document.createElement('img');
    pistolaImg.src = 'Imagenes Casino/pistola.gif'; 
    pistolaImg.alt = 'Pistola';
    pistolaImg.style.cssText = `
        width: 500px;
        height: auto;
    `;
    
    const textoFinal = document.createElement('h2');
    textoFinal.textContent = '💀 GAME OVER 💀';
    textoFinal.className = 'modal-text';
    textoFinal.style.cssText = `
        color: #ff0000;
        font-size: 3em;
        animation: parpadeo 0.5s infinite;
    `;
    
    pistolaContainer.appendChild(pistolaImg);
    pistolaContainer.appendChild(textoFinal);
    modalContainer.appendChild(pistolaContainer);
    
    // Reproducir sonido de disparo
   // Detener música de fondo y reproducir sonido de disparo
    const musicaFondo = document.getElementById('musicaFondo');
    const audioDisparo = document.getElementById('audioDisparo');

    if (musicaFondo) {
        musicaFondo.pause();
    }

    if (audioDisparo) {
        audioDisparo.currentTime = 0;
        audioDisparo.play().catch(err => console.warn('Error al reproducir disparo:', err));
    }
    // Efecto de pantalla roja (disparo)
    setTimeout(() => {
        document.body.style.backgroundColor = 'red';
        document.body.style.transition = 'background-color 0.1s';
        
        setTimeout(() => {
            document.body.style.backgroundColor = '';
        }, 200);
    }, 1500);
    
    // Cerrar modal después de 4 segundos
    setTimeout(() => {
        pistolaContainer.remove();
        ruletaContainer.style.display = 'flex';
        modalText.style.display = 'block';
        modalP.style.display = 'block';
        cerrarModal();
    }, 4000);
}




//pistola//

function createDeck() {
  deck = [];
  const suits = ['C', 'D', 'H', 'S'];
  const ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];


   setTimeout(() => {
        const anguloFinal = anguloAcumulado % 360;
        const color = anguloFinal < 180 ? "rojo" : "negro";
    
        if(color === "rojo"){
            alert("❤️¡Uf, por los pelos! Te salvaste y sigues jugando...🥳");
            cerrarModal();
        } else {
            // Mostrar pistola y disparo
            mostrarPistolaYDisparar();
        }
    }, 2000);
};

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

 
  if (musicaIniciada && !musicaPausada) {
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

const gameButtons = document.querySelectorAll('button:not(#musicBtn)');
gameButtons.forEach(button => {
  button.addEventListener('click', function() {
    playSound('audioClick');
  });
});

