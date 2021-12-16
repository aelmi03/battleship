import Player from './Player';
import Pubsub from './Pubsub';
import '../components/PreGameSection';
import '../components/GameboardsSection';

export const humanPlayer = Player('Player');
const computerPlayer = Player('Computer');
function placeShip(arrayOfCoordinates) {
  humanPlayer.gameBoard.placeShip(...arrayOfCoordinates);
  Pubsub.publish('updatePreGameBattleShip', humanPlayer);
}
function setUpEnemyShip() {
  computerPlayer.gameBoard.placeShipRandomly(5);
  computerPlayer.gameBoard.placeShipRandomly(4);
  computerPlayer.gameBoard.placeShipRandomly(3);
  computerPlayer.gameBoard.placeShipRandomly(2);
  computerPlayer.gameBoard.placeShipRandomly(2);
}
function startGame(name) {
  if (name) {
    humanPlayer.setName(name);
  }
  humanPlayer.gameBoard.printShipToConsole();
  Pubsub.publish('Destroy Pre-game Section');
  setUpEnemyShip();
  Pubsub.publish('Start Game', [humanPlayer, computerPlayer]);
}

Pubsub.publish('loadPreGame', humanPlayer);
Pubsub.subscribe('User placed valid ship coordinates', placeShip);
Pubsub.subscribe('User clicked start game', startGame);
