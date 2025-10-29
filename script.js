getRandomCardPc() 
getRandomUserCard() 
getRandomrouletteColor() 
getRandomIcon() 
getRandomNumber()   
const randomNumber = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
const randomIcon = ['♣','♦','♥','♠'];
const randomRouletteColor = ['red','black']; // Note: not used yet

// Single function since both do the same thing
function getRandomCard() {
    const randomIndexNumber = Math.floor(Math.random() * randomNumber.length);
    const randomIndexIcon = Math.floor(Math.random() * randomIcon.length);
    return `${randomNumber[randomIndexNumber]}${randomIcon[randomIndexIcon]}`;
}

// Generate cards when needed
const cartaPc = getRandomCard();
const cartaUser = getRandomCard();

console.log("Carta PC: " + cartaPc);
console.log("Carta User: " + cartaUser);