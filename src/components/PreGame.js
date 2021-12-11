import Pubsub from '../battleship-logic/Pubsub';

function appendAllChildren(arrayOfChildrenDivs, parentDiv) {
  for (let i = 0; i < arrayOfChildrenDivs.length; i += 1) {
    parentDiv.appendChild(arrayOfChildrenDivs[i]);
  }
}
function createPreGameBattleBoard(player) {
  const battleShipDiv = document.createElement('div');
  battleShipDiv.classList.add('battleship');
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const battleShipCoordinate = document.createElement('div');
      battleShipCoordinate.classList.add('battleship-spot');
      battleShipCoordinate.setAttribute('x-position', i);
      battleShipCoordinate.setAttribute('y-position', j);
      if (player.gameBoard.coordinates[i][j]) {
        battleShipCoordinate.style.background = 'orange';
      }
      battleShipDiv.appendChild(battleShipCoordinate);
    }
  }
  return battleShipDiv;
}
function createShipDiv(length) {
  const mainShipDiv = document.createElement('div');
  mainShipDiv.classList.add('ship');
  mainShipDiv.setAttribute('draggable', 'true');
  for (let i = 0; i < length; i += 1) {
    const shipPositionDiv = document.createElement('div');
    shipPositionDiv.classList.add('ship-position');
    mainShipDiv.appendChild(shipPositionDiv);
  }
  return mainShipDiv;
}
function createShipsToPlaceDiv() {
  const shipPlacerDiv = document.createElement('div');
  shipPlacerDiv.classList.add('ships-to-place');
  const shipOfLengthFiveDiv = createShipDiv(5);
  const shipOfLengthFourDiv = createShipDiv(4);
  const shipOfLengthThreeDiv = createShipDiv(3);
  const shipOfLengthTwoDiv = createShipDiv(2);
  const secondShipOfLengthTwoDiv = createShipDiv(2);
  appendAllChildren(
    [
      shipOfLengthFiveDiv,
      shipOfLengthFourDiv,
      shipOfLengthThreeDiv,
      shipOfLengthTwoDiv,
      secondShipOfLengthTwoDiv,
    ],
    shipPlacerDiv
  );
  return shipPlacerDiv;
}
function createPreGameOptions() {
  const optionsDiv = document.createElement('div');
  optionsDiv.classList.add('options');
  const placeShipsHeader = document.createElement('h2');
  placeShipsHeader.textContent = 'Place Your Ships!';
  const switchDirectionButton = document.createElement('button');
  switchDirectionButton.classList.add('switch-direction');
  switchDirectionButton.textContent = 'Switch Direction';
  const shipsToPlaceDiv = createShipsToPlaceDiv();
  appendAllChildren(
    [placeShipsHeader, switchDirectionButton, shipsToPlaceDiv],
    optionsDiv
  );
  return optionsDiv;
}
function createFormElement() {
  const form = document.createElement('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });
  const label = document.createElement('label');
  label.setAttribute('for', 'player-name');
  label.textContent = 'Name:';
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'player-name');
  input.setAttribute('id', 'player-name');
  input.setAttribute('required', '');
  appendAllChildren([label, input], form);
  return form;
}
function createNameAndStartGameComponents() {
  const startGameContainer = document.createElement('div');
  startGameContainer.classList.add('start-game-container');
  const form = createFormElement();
  const startButton = document.createElement('button');
  startButton.classList.add('start-game');
  startButton.textContent = 'Start Game!';
  appendAllChildren([form, startButton], startGameContainer);
  return startGameContainer;
}
/*
<div class="start-game-container">
    <form action="#" novalidate>
      <label for="player-name">Name:</label>
      <input type="text" name="player-name" id="player-name" required />
    </form>
    <button class="start-game">Start Game!</button>
  </div>
*/
function createPreGameComponents(player) {
  const container = document.createElement('div');
  container.classList.add('container');
  const battleBoardComponent = createPreGameBattleBoard(player);
  const gameOptionsComponent = createPreGameOptions();
  const nameAndStartGameComponent = createNameAndStartGameComponents();
  appendAllChildren([battleBoardComponent, gameOptionsComponent], container);
  document.body.appendChild(container);
  document.body.appendChild(nameAndStartGameComponent);
}
Pubsub.subscribe('loadPreGame', createPreGameComponents);
Pubsub.subscribe('updatePreGameBattleShip', createPreGameBattleBoard);
