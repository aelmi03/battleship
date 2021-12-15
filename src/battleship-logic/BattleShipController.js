import Player from './Player';
import Pubsub from './Pubsub';
import '../components/PreGame';

export const humanPlayer = Player('Player');
const computerPlayer = Player('Computer');
function placeShip(arrayOfCoordinates) {
  humanPlayer.gameBoard.placeShip(...arrayOfCoordinates);
  Pubsub.publish('updatePreGameBattleShip', humanPlayer);
}
function startGame(name) {
  if (name) {
    humanPlayer.setName(name);
  }
  humanPlayer.gameBoard.printShipToConsole();
  Pubsub.publish('Destroy Pre-game Section');
  Pubsub.publish('Start Game');
}

Pubsub.publish('loadPreGame', humanPlayer);
Pubsub.subscribe('User placed valid ship coordinates', placeShip);
Pubsub.subscribe('User clicked start game', startGame);
