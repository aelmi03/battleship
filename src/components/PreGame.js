import Player from '../battleship-logic/Player';
import Pubsub from '../battleship-logic/Pubsub';

const container = document.querySelectorAll('.container');
function createPreGameBattleBoard(player) {
  const battleShip = document.createElement('div');
  battleShip.classList.add('battleship');
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const battleShipCoordinate = document.createElement('div');
      if (player.coordinates[i][j]) {
        battleShipCoordinate.style.background = 'orange';
      }
      battleShip.appendChild(battleShipCoordinate);
    }
  }
  return battleShip;
}
function createPreGameComponents(player) {
  container.textContent = '';
  const battleBoardComponent = createPreGameBattleBoard(player);
  const gameOptionsComponent = createPreGameOptions();
  const nameAndStartGameComponent = createNameAndStartGameComponent();
  container.appendChild(battleBoardComponent);
  container.appendChild(gameOptionsComponent);
  container.appendChild(nameAndStartGameComponent);
}
Pubsub.subscribe('loadPreGame', createPreGameComponents);
Pubsub.subscribe('updatePreGameBattleShip', createPreGameBattleBoard);
