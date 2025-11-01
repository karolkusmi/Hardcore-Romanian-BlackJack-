const mostrarModal = () => {
     const modal = document.querySelector("#modal-lose"); 
  modal.style.display = "flex";
    
}

const cerrarModal = () => {
    const modal = document.querySelector('#modal-lose');
    modal.style.display = 'none';
}

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
    
        if(color=== "rojo"){
            alert("❤️¡Uf, por los pelos! Te salvaste y sigues gugando...🥳");
         }else{
            alert( "💀¡BOOM! ⚰️ Perdiste definitivamente.🪦");
      
    }
        cerrarModal();
}, 2000);
};

