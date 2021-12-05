import GameBoard from './Gameboard';

export default function Player(name) {
  let playerName = name;
  const attacks = [];
  const gameBoard = GameBoard();
  function hasAlreadyAttackedCoordinate(firstCoordinate, secondCoordinate) {
    for (let i = 0; i < attacks.length; i++) {
      const [firstCoord, secondCoord] = attacks[i];
      if (firstCoord === firstCoordinate && secondCoord === secondCoordinate) {
        return true;
      }
    }
    return false;
  }
  function attack([firstCoordinate, secondCoordinate], enemyGameboard) {
    if (hasAlreadyAttackedCoordinate(firstCoordinate, secondCoordinate)) return;
    attacks.push([firstCoordinate, secondCoordinate]);
    enemyGameboard.receiveAttack(firstCoordinate, secondCoordinate);
  }
  function getName() {
    return playerName;
  }
  function setName(newName) {
    playerName = newName;
  }
  return {
    getName,
    setName,
    gameBoard,
    attack,
    attacks,
  };
}
