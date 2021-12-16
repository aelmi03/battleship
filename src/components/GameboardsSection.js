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
        battleShipSpot.style.background = 'red';
      } else if (player.gameBoard.coordinates[i][j]) {
        battleShipSpot.style.background = 'orange';
      } else if (enemy.hasHit(i, j)) {
        battleShipSpot.style.background = 'green';
      }
      battleShipDiv.appendChild(battleShipSpot);
    }
  }
}

function renderEnemyBattleShip(battleShipDiv, enemy, player) {
  battleShipDiv.textContent = '';
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const battleShipSpot = document.createElement('div');
      battleShipSpot.classList.add('battleship-spot');
      if (enemy.gameBoard.coordinates[i][j] && player.hasHit(i, j)) {
        battleShipSpot.style.background = 'red';
      } else if (player.hasHit(i, j)) {
        battleShipSpot.style.background = 'green';
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
function createGameSection([player, enemy]) {
  console.log('enemyPlayer');
  console.log(enemy);
  const gameContainer = document.createElement('div');
  gameContainer.classList.add('game-container');
  const gameOverHeader = document.createElement('h2');
  gameOverHeader.classList.add('game-over');
  const rematchButton = document.createElement('button');
  rematchButton.classList.add('rematch-button');
  rematchButton.textContent = 'Rematch';
  const battleShipsContainer = createBattleShipsContainer(player, enemy);
  appendAllChildren(
    [gameOverHeader, rematchButton, battleShipsContainer],
    gameContainer
  );
  document.body.appendChild(gameContainer);
}
Pubsub.subscribe('Start Game', createGameSection);
