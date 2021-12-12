import Player from './Player';
import Pubsub from './Pubsub';
import '../components/PreGame';

export const humanPlayer = Player();
const computerPlayer = Player('Computer');
function placeShip(arrayOfCoordinates) {
  humanPlayer.gameBoard.placeShip(...arrayOfCoordinates);
  Pubsub.publish('updatePreGameBattleShip', humanPlayer);
}
Pubsub.publish('loadPreGame', humanPlayer);
Pubsub.subscribe('User placed valid ship coordinates', placeShip);
