import Pubsub from '../battleship-logic/Pubsub';
import appendAllChildren from './PreGameSection';

function createContainerWithBattleShip(
  classOfContainer,
  functionForBattleShip,
  playerObject,
  enemyObject
) {
  const container = document.createElement('div');
  const playerNameHeader = document.createElement('h2');
  playerNameHeader.textContent = playerObject.getName();
  container.classList.add(`${classOfContainer}`);
  const battleShipDiv = document.createElement('div');
  battleShipDiv.classList.add('battleship');
  functionForBattleShip(battleShipDiv, playerObject, enemyObject);
  appendAllChildren([playerNameHeader, battleShipDiv], container);
  return container;
}
function renderPlayerBattleShip(battleShipDiv, player, enemy) {
  battleShipDiv.textContent = '';
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const battleShipSpot = document.createElement('div');
      battleShipSpot.classList.add('battleship-spot');
      if (player.gameBoard.coordinates[i][j] && enemy.hasHit(i, j)) {
        battleShipSpot.style.background = 'rgb(255, 60, 0)';
      } else if (player.gameBoard.coordinates[i][j]) {
        battleShipSpot.style.background = 'rgb(0, 183, 255)';
      } else if (enemy.hasHit(i, j)) {
        battleShipSpot.style.background = 'rgb(0, 255, 64)';
      }
      battleShipDiv.appendChild(battleShipSpot);
    }
  }
}
function receivePlayerAttack(e) {
  const battleShipSpot = e.target;
  const xCoordinate = +battleShipSpot.getAttribute('x-position');
  const yCoordinate = +battleShipSpot.getAttribute('y-position');
  Pubsub.publish('Enemy was attacked', [xCoordinate, yCoordinate]);
}
function renderEnemyBattleShip(battleShipDiv, enemy, player) {
  battleShipDiv.textContent = '';
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const battleShipSpot = document.createElement('div');
      battleShipSpot.classList.add('battleship-spot');
      battleShipSpot.setAttribute('x-position', `${i}`);
      battleShipSpot.setAttribute('y-position', `${j}`);
      if (enemy.gameBoard.coordinates[i][j] && player.hasHit(i, j)) {
        battleShipSpot.style.background = 'rgb(255, 60, 0)';
      } else if (player.hasHit(i, j)) {
        battleShipSpot.style.background = 'rgb(0, 255, 64)';
      } else {
        battleShipSpot.addEventListener('click', receivePlayerAttack);
      }
      battleShipDiv.appendChild(battleShipSpot);
    }
  }
}
function createBattleShipsContainer(player, enemy) {
  const battleShipsContainer = document.createElement('div');
  battleShipsContainer.classList.add('battleships-container');
  const playerContainer = createContainerWithBattleShip(
    'player-container',
    renderPlayerBattleShip,
    player,
    enemy
  );
  const enemyContainer = createContainerWithBattleShip(
    'computer-container',
    renderEnemyBattleShip,
    enemy,
    player
  );
  appendAllChildren([playerContainer, enemyContainer], battleShipsContainer);
  return battleShipsContainer;
}
function updateEnemyGameboard([enemy, player]) {
  const enemyBattleShip = document.querySelector(
    '.computer-container > .battleship '
  );
  renderEnemyBattleShip(enemyBattleShip, enemy, player);
}
function updatePlayerGameboard([player, enemy]) {
  const playerBattleShip = document.querySelector(
    '.player-container > .battleship'
  );
  renderPlayerBattleShip(playerBattleShip, player, enemy);
}
function restartGame() {
  Pubsub.publish('User clicked restart game');
}
function createGameSection([player, enemy]) {
  const gameContainer = document.createElement('div');
  gameContainer.classList.add('game-container');
  const gameOverHeader = document.createElement('h2');
  gameOverHeader.classList.add('game-over');
  const rematchButton = document.createElement('button');
  rematchButton.classList.add('rematch-button');
  rematchButton.textContent = 'Rematch';
  rematchButton.addEventListener('click', restartGame);
  const battleShipsContainer = createBattleShipsContainer(player, enemy);
  appendAllChildren(
    [gameOverHeader, rematchButton, battleShipsContainer],
    gameContainer
  );
  document.body.appendChild(gameContainer);
}
function endGame(playerObject) {
  const header = document.querySelector('.game-over');
  const enemyGameboard = document.querySelector(
    '.computer-container > .battleship'
  );
  enemyGameboard.style.pointerEvents = 'none';
  if (playerObject.getName().includes('Enemy')) {
    header.textContent = 'You have lost :(';
  } else {
    header.textContent = 'Congratulations, You have won!';
  }
  header.style.color = 'white';
}
function destroyGameboards() {
  const gameContainer = document.querySelector('.game-container');
  gameContainer.textContent = '';
  document.body.removeChild(gameContainer);
}
Pubsub.subscribe('Start Game', createGameSection);
Pubsub.subscribe('Update enemy board', updateEnemyGameboard);
Pubsub.subscribe('Update player board', updatePlayerGameboard);
Pubsub.subscribe('Player has won', endGame);
Pubsub.subscribe('Computer has won', endGame);
Pubsub.subscribe('Destroy Gameboards Section', destroyGameboards);
