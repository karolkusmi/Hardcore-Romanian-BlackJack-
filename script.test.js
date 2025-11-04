import { calculateGameResult, createDeck } from './script.js';

describe('BlackJack Game Tests', () => {
  
  // TEST 1: Verificar que el mazo se crea correctamente
  describe('createDeck function', () => {
    test('debe crear un mazo con 52 cartas', () => {
      const deck = createDeck();
      expect(deck.length).toBe(52);
    });

    test('debe contener cartas con todas las propiedades necesarias', () => {
      const deck = createDeck();
      
      // Verificar que cada carta tenga las propiedades correctas
      deck.forEach(card => {
        expect(card).toHaveProperty('valor');
        expect(card).toHaveProperty('img');
        expect(card).toHaveProperty('name');
        expect(typeof card.valor).toBe('number');
        expect(typeof card.img).toBe('string');
        expect(typeof card.name).toBe('string');
      });
    });

    test('debe asignar valores correctos a las cartas especiales', () => {
      const deck = createDeck();
      
      // Verificar que los Ases valen 11
      const ases = deck.filter(card => card.name.startsWith('A'));
      ases.forEach(as => {
        expect(as.valor).toBe(11);
      });

      // Verificar que J, Q, K valen 10
      const figuras = deck.filter(card => 
        card.name.startsWith('J') || 
        card.name.startsWith('Q') || 
        card.name.startsWith('K')
      );
      figuras.forEach(figura => {
        expect(figura.valor).toBe(10);
      });

      // Verificar que las cartas numéricas tienen su valor correcto
      const numericas = deck.filter(card => 
        !isNaN(parseInt(card.name.charAt(0))) && 
        card.name.charAt(0) !== 'A'
      );
      numericas.forEach(carta => {
        const numeroEsperado = parseInt(carta.name.match(/^\d+/)[0]);
        expect(carta.valor).toBe(numeroEsperado);
      });
    });
  });

  // TEST 2: Verificar la lógica del resultado del juego
  describe('Game Result Logic', () => {
    
    test('debe devolver "lose" cuando el jugador se pasa de 21', () => {
      expect(calculateGameResult(22, 18)).toBe('lose');
      expect(calculateGameResult(25, 20)).toBe('lose');
      expect(calculateGameResult(30, 15)).toBe('lose');
    });

    test('debe devolver "win" cuando el dealer se pasa de 21', () => {
      expect(calculateGameResult(20, 22)).toBe('win');
      expect(calculateGameResult(18, 25)).toBe('win');
      expect(calculateGameResult(15, 30)).toBe('win');
    });

    test('debe devolver "win" cuando el jugador tiene más puntos que el dealer (sin pasarse)', () => {
      expect(calculateGameResult(20, 18)).toBe('win');
      expect(calculateGameResult(21, 19)).toBe('win');
      expect(calculateGameResult(19, 17)).toBe('win');
    });

    test('debe devolver "lose" cuando el dealer tiene más puntos que el jugador', () => {
      expect(calculateGameResult(18, 20)).toBe('lose');
      expect(calculateGameResult(17, 19)).toBe('lose');
      expect(calculateGameResult(15, 18)).toBe('lose');
    });

    test('debe devolver "draw" cuando ambos tienen los mismos puntos', () => {
      expect(calculateGameResult(20, 20)).toBe('draw');
      expect(calculateGameResult(18, 18)).toBe('draw');
      expect(calculateGameResult(21, 21)).toBe('draw');
    });

    test('debe manejar el BlackJack (21 puntos) correctamente', () => {
      expect(calculateGameResult(21, 20)).toBe('win');
      expect(calculateGameResult(20, 21)).toBe('lose');
      expect(calculateGameResult(21, 21)).toBe('draw');
    });
  });
});