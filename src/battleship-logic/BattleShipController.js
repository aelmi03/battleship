import Player from './Player';
import Pubsub from './Pubsub';
import '../components/PreGameSection';
import '../components/GameboardsSection';

export let humanPlayer = Player('Player');
let computerPlayer = Player('Enemy');
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
function receiveAttackFromPlayer([xCoordinate, yCoordinate]) {
  humanPlayer.attack([xCoordinate, yCoordinate], computerPlayer.gameBoard);
  Pubsub.publish('Update enemy board', [computerPlayer, humanPlayer]);
  if (computerPlayer.gameBoard.allShipsAreSunk()) {
    Pubsub.publish('Player has won', humanPlayer);
    return;
  }
  computerPlayer.computerAttack(humanPlayer.gameBoard);
  Pubsub.publish('Update player board', [humanPlayer, computerPlayer]);
  if (humanPlayer.gameBoard.allShipsAreSunk()) {
    Pubsub.publish('Computer has won', computerPlayer);
  }
}
function restartGame() {
  Pubsub.publish('Destroy Gameboards Section');
  humanPlayer = Player('Player');
  computerPlayer = Player('Enemy');
  Pubsub.publish('loadPreGame', humanPlayer);
}
Pubsub.publish('loadPreGame', humanPlayer);
Pubsub.subscribe('User placed valid ship coordinates', placeShip);
Pubsub.subscribe('User clicked start game', startGame);
Pubsub.subscribe('Enemy was attacked', receiveAttackFromPlayer);
Pubsub.subscribe('User clicked restart game', restartGame);
