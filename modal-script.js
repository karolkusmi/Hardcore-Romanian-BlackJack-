// VARIABLES GLOBALES PARA EL MODAL 
let anguloAcumulado = 0;
let musicaFondo;
let musicaPausada = false;
let musicaIniciada = false;
let musicControlBtn;
let musicIcon;

// Inicializar elementos del DOM solo si están disponibles
function initModalDOM() {
  if (typeof document === 'undefined') return;
  
  musicaFondo = document.getElementById("musicaFondo");
  musicControlBtn = document.getElementById("musicBtn");
  musicIcon = document.getElementById("musicIcon");

  if (musicaFondo) {
    musicaFondo.volume = 0.3;
  }
}

// CONTROL DE MÚSICA 
function setupMusicControl() {
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
}


function setupAutoPlay() {
  if (typeof document === 'undefined') return;
  
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
}


if (typeof document !== 'undefined') {
  initModalDOM();
  setupMusicControl();
  setupAutoPlay();
}

export function mostrarModal() {
  const modal = document.querySelector("#modal-lose");
  if (modal) {
    modal.style.display = "flex";
    console.log("🎯 Modal mostrado - Ruleta de la muerte activada");
    
    
    setTimeout(() => {
      girarRuleta();
    }, 1000);
  } else {
    console.error("❌ No se encontró el modal #modal-lose");
  }
}

export function cerrarModal() {
  const modal = document.querySelector('#modal-lose');
  if (modal) {
    modal.style.display = 'none';
    console.log("🎯 Modal cerrado");
  }
}


export function determinarResultadoRuleta(anguloFinal) {
  return anguloFinal < 180 ? "rojo" : "negro";
}


export function generarGiroRuleta() {
  return Math.floor(Math.random() * 360) + 720;
}

export function girarRuleta() {
  const ruleta = document.getElementById('ruleta');
  if (!ruleta) {
    console.error("❌ No se encontró el elemento ruleta");
    return;
  }
  
  
  const vueltas = 3 + Math.random() * 3; 
  const anguloExtra = Math.random() * 360;
  const anguloTotal = (vueltas * 360) + anguloExtra;
  
  anguloAcumulado += anguloTotal;
  
  console.log(`🎲 Girando ruleta: ${anguloTotal}° (Total: ${anguloAcumulado}°)`);
  
  
  ruleta.style.transition = 'transform 2s ease-out';
  ruleta.style.transform = `rotate(${anguloAcumulado}deg)`;
  
  
  setTimeout(() => {
    const anguloFinal = anguloAcumulado % 360;
    const color = determinarResultadoRuleta(anguloFinal);
    
    console.log(`🎯 Resultado: ${color} (${anguloFinal}°)`);
    
    if (color === "rojo") {
      
      setTimeout(() => {
        alert("❤️ ¡Uf, por los pelos! Te salvaste y sigues jugando... 🥳");
        cerrarModal();
      }, 500);
    } else {
      
      setTimeout(() => {
        mostrarPistolaYDisparar();
      }, 500);
    }
  }, 2000);
}


export const mostrarPistolaYDisparar = () => {
  
  const modalContainer = document.querySelector('.modal-container');
  const ruletaContainer = document.querySelector('.ruleta-container');
  const modalText = document.querySelector('.modal-text');
  const modalP = document.querySelector('.modal-p');
  
  if (!modalContainer) {
    console.error("❌ No se encontró modal-container");
    return;
  }
  
  
  if (ruletaContainer) ruletaContainer.style.display = 'none';
  if (modalText) modalText.style.display = 'none';
  if (modalP) modalP.style.display = 'none';
  
  
  const pistolaContainer = document.createElement('div');
  pistolaContainer.id = 'pistola-container';
  pistolaContainer.style.cssText = `
      position: relative;
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
      z-index: 5;
  `;
  
  const textoFinal = document.createElement('h2');
  textoFinal.textContent = '💀 GAME OVER 💀';
  textoFinal.className = 'modal-text';
  textoFinal.style.cssText = `
      color: #ff0000;
      font-size: 3em;
      animation: parpadeo 0.5s infinite;
      z-index: 6;
  `;
  
  pistolaContainer.appendChild(pistolaImg);
  pistolaContainer.appendChild(textoFinal);
  modalContainer.appendChild(pistolaContainer);
  

  const audioDisparo = document.getElementById('audioDisparo');
  if (musicaFondo) musicaFondo.pause();
  if (audioDisparo) {
    audioDisparo.currentTime = 0;
    audioDisparo.play().catch(err => console.warn('Error al reproducir disparo:', err));
  }

  
  const fuegoPantalla = document.createElement('img');
  fuegoPantalla.src = 'Imagenes Casino/fuego.gif'; 
  fuegoPantalla.alt = 'Fuego pantalla';
  fuegoPantalla.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      object-fit: cover;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease-in;
  `;
  
  document.body.appendChild(fuegoPantalla);

 
  setTimeout(() => {
    fuegoPantalla.style.opacity = '1';
  }, 0);

 
  setTimeout(() => {
    fuegoPantalla.style.opacity = '0';
    setTimeout(() => fuegoPantalla.remove(), 300);
  }, 750);

 
  setTimeout(() => {
    document.body.style.backgroundColor = 'red';
    document.body.style.transition = 'background-color 0.1s';
    
    setTimeout(() => {
      document.body.style.backgroundColor = '';
    }, 200);
  }, 1500);
  
  
  setTimeout(() => {
    pistolaContainer.remove();
    if (ruletaContainer) ruletaContainer.style.display = 'flex';
    if (modalText) modalText.style.display = 'block';
    if (modalP) modalP.style.display = 'block';
    cerrarModal();
  }, 4000);
};
