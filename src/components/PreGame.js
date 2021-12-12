import Pubsub from '../battleship-logic/Pubsub';
import { humanPlayer } from '../battleship-logic/BattleShipController';

function appendAllChildren(arrayOfChildrenDivs, parentDiv) {
  for (let i = 0; i < arrayOfChildrenDivs.length; i += 1) {
    parentDiv.appendChild(arrayOfChildrenDivs[i]);
  }
}
function switchDirectionOfShips(e) {
  const ships = document.querySelectorAll('.ship');
  if (e.target.textContent === 'Horizontal') {
    ships.forEach((ship) => (ship.style.flexFlow = 'column wrap'));
    e.target.textContent = 'Vertical';
  } else {
    ships.forEach((ship) => (ship.style.flexFlow = 'row wrap'));
    e.target.textContent = 'Horizontal';
  }
}
function makeValidDragSpot(e) {
  e.preventDefault();
}
function dropListener(e) {
  e.preventDefault();
  const nameAndLength = String(e.dataTransfer.getData('text/plain')).split(' ');
  const direction = document.querySelector('.switch-direction').textContent;
  const xCoord = +e.target.getAttribute('x-position');
  const yCoord = +e.target.getAttribute('y-position');
  const coordinates = humanPlayer.gameBoard.getCoordinates(
    [xCoord, yCoord],
    nameAndLength[1],
    direction
  );
  if (humanPlayer.gameBoard.coordinatesAreAllowed(coordinates)) {
    console.log(coordinates);
    Pubsub.publish('User placed valid ship coordinates', coordinates);
  }
}
function createPreGameBattleBoard(player, battleShipDiv) {
  battleShipDiv.textContent = '';
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const battleShipCoordinate = document.createElement('div');
      battleShipCoordinate.addEventListener('dragenter', makeValidDragSpot);
      battleShipCoordinate.addEventListener('dragover', makeValidDragSpot);
      battleShipCoordinate.addEventListener('drop', dropListener);
      battleShipCoordinate.classList.add('battleship-spot');
      battleShipCoordinate.setAttribute('x-position', i);
      battleShipCoordinate.setAttribute('y-position', j);
      if (player.gameBoard.coordinates[i][j]) {
        battleShipCoordinate.style.background = 'orange';
      }
      battleShipDiv.appendChild(battleShipCoordinate);
    }
  }
}
function updatePreGameBattleShip(player) {
  const battleShipComponent = document.querySelector('.battleship');
  createPreGameBattleBoard(player, battleShipComponent);
}
function dragStart(shipDiv) {
  shipDiv.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData(
      'text/plain',
      `${e.target.id} ${shipDiv.getAttribute('length')}`
    );
  });
}

function createShipDiv(length) {
  const mainShipDiv = document.createElement('div');
  mainShipDiv.classList.add('ship');
  mainShipDiv.setAttribute('draggable', 'true');
  mainShipDiv.setAttribute('id', `Ship ${length}`);
  mainShipDiv.setAttribute('length', `${length}`);

  dragStart(mainShipDiv);
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
  const carrierDiv = createShipDiv(5);
  const battleShipDiv = createShipDiv(4);
  const cruiserDiv = createShipDiv(3);
  const destroyerDiv = createShipDiv(2);
  const secondDestroyerDiv = createShipDiv(2);
  appendAllChildren(
    [carrierDiv, battleShipDiv, cruiserDiv, destroyerDiv, secondDestroyerDiv],
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
  switchDirectionButton.addEventListener('click', switchDirectionOfShips);
  switchDirectionButton.classList.add('switch-direction');
  switchDirectionButton.textContent = 'Horizontal';
  const shipsToPlaceDiv = createShipsToPlaceDiv();
  appendAllChildren(
    [placeShipsHeader, switchDirectionButton, shipsToPlaceDiv],
    optionsDiv
  );
  return optionsDiv;
}
function createFormElement() {
  const form = document.createElement('form');
  form.setAttribute('novalidate', '');
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

function createPreGameComponents(player) {
  const container = document.createElement('div');
  container.classList.add('container');
  const battleBoardComponent = document.createElement('div');
  battleBoardComponent.classList.add('battleship');
  createPreGameBattleBoard(player, battleBoardComponent);
  const gameOptionsComponent = createPreGameOptions();
  const nameAndStartGameComponent = createNameAndStartGameComponents();
  appendAllChildren([battleBoardComponent, gameOptionsComponent], container);
  document.body.appendChild(container);
  document.body.appendChild(nameAndStartGameComponent);
}
Pubsub.subscribe('loadPreGame', createPreGameComponents);
Pubsub.subscribe('updatePreGameBattleShip', updatePreGameBattleShip);
