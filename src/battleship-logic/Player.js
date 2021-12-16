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
  function getANumberBetweenZeroAndNine() {
    return Math.floor(Math.random() * 10);
  }
  function randomAttack(enemyGameboard) {
    while (true) {
      const firstCoord = getANumberBetweenZeroAndNine();
      const secondCoord = getANumberBetweenZeroAndNine();
      if (!hasAlreadyAttackedCoordinate(firstCoord, secondCoord)) {
        attacks.push([firstCoord, secondCoord]);
        enemyGameboard.receiveAttack(firstCoord, secondCoord);
        return;
      }
    }
  }
  function getName() {
    return playerName;
  }
  function setName(newName) {
    playerName = newName;
  }
  function hasHit(xCoord, yCoord) {
    for (let i = 0; i < attacks.length; i += 1) {
      const pairOfCoords = attacks[i];
      const [xCoordinate, yCoordinate] = pairOfCoords;
      if (xCoordinate === xCoord && yCoordinate === yCoord) {
        return true;
      }
    }
    return false;
  }
  return {
    getName,
    setName,
    gameBoard,
    attack,
    attacks,
    randomAttack,
    hasHit,
  };
}
