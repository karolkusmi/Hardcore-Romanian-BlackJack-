// ============ VARIABLES GLOBALES PARA EL MODAL ============
let anguloAcumulado = 0;
const musicaFondo = document.getElementById("musicaFondo");
let musicaPausada = false;
let musicaIniciada = false;

// ============ CONTROL DE MÚSICA ============
const musicControlBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");

if (musicaFondo) {
  musicaFondo.volume = 0.3;
}

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

// Auto-iniciar música en la primera interacción
document.addEventListener("click", function reproducirMusica() {
  if (!musicaIniciada && musicaFondo) {
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

// ============ FUNCIONES DEL MODAL ============
function mostrarModal() {
  const modal = document.querySelector("#modal-lose");
  if (modal) {
    modal.style.display = "flex";
    console.log("🎯 Modal mostrado - Ruleta de la muerte activada");
    
    // Iniciar la ruleta automáticamente después de un momento
    setTimeout(() => {
      girarRuleta();
    }, 1000);
  } else {
    console.error("❌ No se encontró el modal #modal-lose");
  }
}

function cerrarModal() {
  const modal = document.querySelector('#modal-lose');
  if (modal) {
    modal.style.display = 'none';
    console.log("🎯 Modal cerrado");
  }
}

function girarRuleta() {
  const ruleta = document.getElementById('ruleta');
  if (!ruleta) {
    console.error("❌ No se encontró el elemento ruleta");
    return;
  }
  
  // Generar rotación aleatoria (al menos 3 vueltas completas + ángulo aleatorio)
  const vueltas = 3 + Math.random() * 3; // Entre 3 y 6 vueltas
  const anguloExtra = Math.random() * 360;
  const anguloTotal = (vueltas * 360) + anguloExtra;
  
  anguloAcumulado += anguloTotal;
  
  console.log(`🎲 Girando ruleta: ${anguloTotal}° (Total: ${anguloAcumulado}°)`);
  
  // Aplicar la rotación con animación
  ruleta.style.transition = 'transform 2s ease-out';
  ruleta.style.transform = `rotate(${anguloAcumulado}deg)`;
  
  // Calcular el resultado después de la animación
  setTimeout(() => {
    const anguloFinal = anguloAcumulado % 360;
    const color = anguloFinal < 180 ? "rojo" : "negro";
    
    console.log(`🎯 Resultado: ${color} (${anguloFinal}°)`);
    
    if (color === "rojo") {
      // Salvado - puede seguir jugando
      setTimeout(() => {
        alert("❤️ ¡Uf, por los pelos! Te salvaste y sigues jugando... 🥳");
        cerrarModal();
      }, 500);
    } else {
      // Perdió - mostrar pistola y disparo
      setTimeout(() => {
        mostrarPistolaYDisparar();
      }, 500);
    }
  }, 2000);
}

// ============ FUNCIÓN DE LA PISTOLA ============
const mostrarPistolaYDisparar = () => {
  // Ocultar el contenido de la ruleta
  const modalContainer = document.querySelector('.modal-container');
  const ruletaContainer = document.querySelector('.ruleta-container');
  const modalText = document.querySelector('.modal-text');
  const modalP = document.querySelector('.modal-p');
  
  if (!modalContainer) {
    console.error("❌ No se encontró modal-container");
    return;
  }
  
  // Ocultar elementos de la ruleta
  if (ruletaContainer) ruletaContainer.style.display = 'none';
  if (modalText) modalText.style.display = 'none';
  if (modalP) modalP.style.display = 'none';
  
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
  
  // Detener música de fondo y reproducir sonido de disparo
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
  
  // Cerrar modal después de 4 segundos y restaurar elementos
  setTimeout(() => {
    pistolaContainer.remove();
    if (ruletaContainer) ruletaContainer.style.display = 'flex';
    if (modalText) modalText.style.display = 'block';
    if (modalP) modalP.style.display = 'block';
    cerrarModal();
  }, 4000);
}

// ============ FUNCIONES DE SONIDO ============
function playButtonSound(soundFile) {
  const audio = new Audio(soundFile);
  audio.volume = 0.5;
  audio.play().catch(err => console.log("Error al reproducir sonido:", err));
}

function playSound(audioId) {
  const audio = document.getElementById(audioId);
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Error al reproducir audio:', e));
  }
}

// ============ EVENT LISTENERS PARA BOTONES ============
const gameButtons = document.querySelectorAll('button:not(#musicBtn)');
gameButtons.forEach(button => {
  button.addEventListener('click', function() {
    playSound('audioClick');
  });
});