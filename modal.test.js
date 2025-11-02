/**
 * @jest-environment jsdom
 */

// Mock del DOM para las pruebas del modallñññ
beforeEach(() => {
  document.body.innerHTML = `
    <div id="modal-lose" style="display: none;">
      <div id="ruleta"></div>
    </div>
  `;
});

// Funciones extraídas del modal-script.js para testing
const mostrarModal = () => {
  const modal = document.querySelector("#modal-lose"); 
  modal.style.display = "flex";
};

const cerrarModal = () => {
  const modal = document.querySelector('#modal-lose');
  modal.style.display = 'none';
};

// Función para determinar el resultado de la ruleta basado en el ángulo
function determinarResultadoRuleta(anguloFinal) {
  return anguloFinal < 180 ? "rojo" : "negro";
}

// Función para generar un giro aleatorio de la ruleta
function generarGiroRuleta() {
  return Math.floor(Math.random() * 360) + 720;
}

describe('Modal and Roulette Tests', () => {
  
  // TEST 1: Verificar funcionalidad del modal
  describe('Modal functionality', () => {
    
    test('debe mostrar el modal cuando se llama mostrarModal()', () => {
      const modal = document.querySelector("#modal-lose");
      
      // Inicialmente el modal está oculto
      expect(modal.style.display).toBe('none');
      
      // Mostrar el modal
      mostrarModal();
      
      // Verificar que el modal ahora esté visible
      expect(modal.style.display).toBe('flex');
    });

    test('debe ocultar el modal cuando se llama cerrarModal()', () => {
      const modal = document.querySelector("#modal-lose");
      
      // Primero mostrar el modal
      modal.style.display = 'flex';
      expect(modal.style.display).toBe('flex');
      
      // Cerrar el modal
      cerrarModal();
      
      // Verificar que el modal esté oculto
      expect(modal.style.display).toBe('none');
    });

    test('debe existir el elemento ruleta dentro del modal', () => {
      const ruleta = document.querySelector("#ruleta");
      expect(ruleta).toBeTruthy();
      expect(ruleta.id).toBe('ruleta');
    });

    test('debe poder alternar entre mostrar y ocultar el modal múltiples veces', () => {
      const modal = document.querySelector("#modal-lose");
      
      // Estado inicial
      expect(modal.style.display).toBe('none');
      
      // Mostrar -> ocultar -> mostrar -> ocultar
      mostrarModal();
      expect(modal.style.display).toBe('flex');
      
      cerrarModal();
      expect(modal.style.display).toBe('none');
      
      mostrarModal();
      expect(modal.style.display).toBe('flex');
      
      cerrarModal();
      expect(modal.style.display).toBe('none');
    });
  });

  // TEST 2: Verificar lógica de la ruleta
  describe('Roulette logic', () => {
    
    test('debe devolver "rojo" para ángulos menores a 180', () => {
      expect(determinarResultadoRuleta(0)).toBe('rojo');
      expect(determinarResultadoRuleta(90)).toBe('rojo');
      expect(determinarResultadoRuleta(179)).toBe('rojo');
      expect(determinarResultadoRuleta(179.9)).toBe('rojo');
    });

    test('debe devolver "negro" para ángulos mayores o iguales a 180', () => {
      expect(determinarResultadoRuleta(180)).toBe('negro');
      expect(determinarResultadoRuleta(270)).toBe('negro');
      expect(determinarResultadoRuleta(359)).toBe('negro');
      expect(determinarResultadoRuleta(180.1)).toBe('negro');
    });

    test('debe generar giros válidos de la ruleta', () => {
      // Ejecutar múltiples veces para verificar el rango
      for (let i = 0; i < 100; i++) {
        const giro = generarGiroRuleta();
        
        // Debe ser mayor o igual a 720 (mínimo 2 vueltas completas)
        expect(giro).toBeGreaterThanOrEqual(720);
        
        // Debe ser menor que 720 + 360 = 1080 (máximo)
        expect(giro).toBeLessThan(1080);
        
        // Debe ser un número entero
        expect(Number.isInteger(giro)).toBe(true);
      }
    });

    test('debe calcular correctamente el ángulo final después del giro', () => {
      // Simular diferentes escenarios de giro
      const testCases = [
        { anguloAcumulado: 720, expected: 0 },    
        { anguloAcumulado: 810, expected: 90 },   
        { anguloAcumulado: 900, expected: 180 }, 
        { anguloAcumulado: 1080, expected: 0 },   
        { anguloAcumulado: 1170, expected: 90 },  
      ];

      testCases.forEach(testCase => {
        const anguloFinal = testCase.anguloAcumulado % 360;
        expect(anguloFinal).toBe(testCase.expected);
      });
    });

    test('debe tener resultados equiprobables en la ruleta', () => {
      const resultados = { rojo: 0, negro: 0 };
      const iteraciones = 10000;
      
      
      for (let i = 0; i < iteraciones; i++) {
        const anguloAleatorio = Math.random() * 360;
        const resultado = determinarResultadoRuleta(anguloAleatorio);
        resultados[resultado]++;
      }
      
      // Verificar que ambos resultados estén cerca del 50% (con margen de error del 5%)
      const porcentajeRojo = (resultados.rojo / iteraciones) * 100;
      const porcentajeNegro = (resultados.negro / iteraciones) * 100;
      
      expect(porcentajeRojo).toBeCloseTo(50, 0); // 0 decimales de precisión (±5%)
      expect(porcentajeNegro).toBeCloseTo(50, 0);
      
      // Verificar que la suma sea 100%
      expect(porcentajeRojo + porcentajeNegro).toBeCloseTo(100, 1);
    });
  });
});