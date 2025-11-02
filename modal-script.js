const mostrarModal = () => {
     const modal = document.querySelector("#modal-lose"); 
  modal.style.display = "flex";
    
}

const cerrarModal = () => {
    const modal = document.querySelector('#modal-lose');
    modal.style.display = 'none';
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

let anguloAcumulado = 0;
const girarRuleta = () => {
    const ruleta = document.querySelector("#ruleta");
    
    const giro = Math.floor(Math.random() * 360) + 720;
    anguloAcumulado += giro;
    
    ruleta.style.transition = "transform 2s cubic-bezier(0.33, 1, 0.68, 1)";
    ruleta.style.transform = `rotate(${anguloAcumulado}deg)`;

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
