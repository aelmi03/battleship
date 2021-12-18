import GameBoard from './Gameboard';

export default function Player(name) {
  let playerName = name;
  const attacks = [];
  const successfulAttacks = [];
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
        if (enemyGameboard.coordinates[firstCoord][secondCoord]) {
          successfulAttacks.push([firstCoord, secondCoord]);
        }
        return;
      }
    }
  }
  function isInRange(firstCoord, secondCoord) {
    if (
      firstCoord >= 0 &&
      firstCoord < 10 &&
      secondCoord >= 0 &&
      secondCoord < 10
    ) {
      return true;
    }
    return false;
  }
  function getAdjacentHit() {
    for (let i = 0; i < successfulAttacks.length; i += 1) {
      const [firstCoord, secondCoord] = successfulAttacks[i];
      if (
        !hasAlreadyAttackedCoordinate(firstCoord, secondCoord - 1) &&
        isInRange(firstCoord, secondCoord - 1)
      ) {
        return [firstCoord, secondCoord - 1];
      }
      if (
        !hasAlreadyAttackedCoordinate(firstCoord, secondCoord + 1) &&
        isInRange(firstCoord, secondCoord + 1)
      ) {
        return [firstCoord, secondCoord + 1];
      }
      if (
        !hasAlreadyAttackedCoordinate(firstCoord - 1, secondCoord) &&
        isInRange(firstCoord - 1, secondCoord)
      ) {
        return [firstCoord - 1, secondCoord];
      }
      if (
        !hasAlreadyAttackedCoordinate(firstCoord + 1, secondCoord) &&
        isInRange(firstCoord + 1, secondCoord)
      ) {
        return [firstCoord + 1, secondCoord];
      }
    }
  }
  function computerAttack(enemyGameboard) {
    if (successfulAttacks.length === 0) {
      randomAttack(enemyGameboard);
    } else if (getAdjacentHit()) {
      const [firstCoord, secondCoord] = getAdjacentHit();
      attacks.push([firstCoord, secondCoord]);
      enemyGameboard.receiveAttack(firstCoord, secondCoord);
      if (enemyGameboard.coordinates[firstCoord][secondCoord]) {
        successfulAttacks.push([firstCoord, secondCoord]);
      }
    } else {
      randomAttack(enemyGameboard);
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
    computerAttack,
    hasHit,
  };
}
