import Pubsub from '../battleship-logic/Pubsub';
import { humanPlayer } from '../battleship-logic/BattleShipController';

let currentDraggedShipLength = null;
export default function appendAllChildren(arrayOfChildrenDivs, parentDiv) {
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
function markSpotsAsAvailable(coordinates) {
  for (let i = 0; i < coordinates.length; i += 1) {
    const battleBoardSpot = document.querySelector(
      `[x-position = "${coordinates[i][0]}"][y-position = "${coordinates[i][1]}"]`
    );
    battleBoardSpot.classList.add('allowed');
    console.log(battleBoardSpot);
  }
}
function dragOverListener(e) {
  e.preventDefault();
  const direction = document.querySelector('.switch-direction').textContent;
  const coordinates = humanPlayer.gameBoard.getCoordinates(
    [
      +e.target.getAttribute('x-position'),
      +e.target.getAttribute('y-position'),
    ],
    currentDraggedShipLength,
    direction
  );
  if (humanPlayer.gameBoard.coordinatesAreAllowed(coordinates)) {
    console.log(coordinates);
    markSpotsAsAvailable(coordinates);
  }
}
function dropListener(e) {
  e.preventDefault();
  const nameAndLength = String(e.dataTransfer.getData('text/plain')).split(' ');
  const direction = document.querySelector('.switch-direction').textContent;
  const coordinates = humanPlayer.gameBoard.getCoordinates(
    [
      +e.target.getAttribute('x-position'),
      +e.target.getAttribute('y-position'),
    ],
    nameAndLength[1],
    direction
  );
  if (humanPlayer.gameBoard.coordinatesAreAllowed(coordinates)) {
    const shipDiv = document.querySelector(`#${nameAndLength[0]}`);
    shipDiv.parentNode.removeChild(shipDiv);
    Pubsub.publish('User placed valid ship coordinates', coordinates);
  }
}
function dragEnterListener(e) {
  e.preventDefault();
}
function dragLeaveListener(e) {
  const allHighlightedSpots = document.querySelectorAll('.allowed');
  if (allHighlightedSpots.length === 0) return;
  allHighlightedSpots.forEach((spot) => spot.classList.remove('allowed'));
  console.log('left a spot');
}
function createPreGameBattleBoard(player, battleShipDiv) {
  battleShipDiv.textContent = '';
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const battleShipCoordinate = document.createElement('div');
      battleShipCoordinate.addEventListener('dragenter', dragEnterListener);
      battleShipCoordinate.addEventListener('dragover', dragOverListener);
      battleShipCoordinate.addEventListener('dragleave', dragLeaveListener);
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
    currentDraggedShipLength = shipDiv.getAttribute('length');
  });
}

function createShipDiv(length, shipID) {
  const mainShipDiv = document.createElement('div');
  mainShipDiv.classList.add('ship');
  mainShipDiv.setAttribute('draggable', 'true');
  mainShipDiv.setAttribute('id', `${shipID}`);
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
  const carrierDiv = createShipDiv(5, 'Carrier');
  const battleShipDiv = createShipDiv(4, 'Battleship');
  const cruiserDiv = createShipDiv(3, 'Cruiser');
  const destroyerDiv = createShipDiv(2, 'Destroyer');
  const submarineDiv = createShipDiv(2, 'Submarine');
  appendAllChildren(
    [carrierDiv, battleShipDiv, cruiserDiv, destroyerDiv, submarineDiv],
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
function startGame() {
  if (humanPlayer.gameBoard.ships.length === 5) {
    Pubsub.publish(
      'User clicked start game',
      document.querySelector('#player-name').value
    );
  }
}
function createNameAndStartGameComponents() {
  const startGameContainer = document.createElement('div');
  startGameContainer.classList.add('start-game-container');
  const form = createFormElement();
  const startButton = document.createElement('button');
  startButton.classList.add('start-game');
  startButton.textContent = 'Start Game!';
  startButton.addEventListener('click', startGame);
  appendAllChildren([form, startButton], startGameContainer);
  return startGameContainer;
}

function createPreGameComponents(player) {
  const container = document.createElement('div');
  container.classList.add('pre-game-container');
  const battleBoardComponent = document.createElement('div');
  battleBoardComponent.classList.add('battleship');
  createPreGameBattleBoard(player, battleBoardComponent);
  const gameOptionsComponent = createPreGameOptions();
  const nameAndStartGameComponent = createNameAndStartGameComponents();
  appendAllChildren([battleBoardComponent, gameOptionsComponent], container);
  document.body.appendChild(container);
  document.body.appendChild(nameAndStartGameComponent);
}
function destroyPreGame() {
  const container = document.querySelector('.pre-game-container');
  container.textContent = '';
  const startGameContainer = document.querySelector('.start-game-container');
  startGameContainer.textContent = '';
  document.body.removeChild(startGameContainer);
  document.body.removeChild(container);
}
Pubsub.subscribe('loadPreGame', createPreGameComponents);
Pubsub.subscribe('updatePreGameBattleShip', updatePreGameBattleShip);
Pubsub.subscribe('Destroy Pre-game Section', destroyPreGame);
