import './reset.css';
import './battleship.css';
import './battleship-logic/BattleShipController';

const divs = document.querySelectorAll('.battleship-spot');
const battleship = document.querySelectorAll('.battleship');

function dropListener(event) {
  event.preventDefault();
}
battleship.addEventListener('drop', dropListener);
divs.forEach((div) => div.addEventListener('drop', dropListener));
divs.forEach((div) => {
  div.addEventListener('dragenter', () => {
    div.style.background = 'blue';
  });
  div.addEventListener('dragleave', () => {
    div.style.background = 'white';
  });
});
