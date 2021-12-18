import Ship from './Ship';

export default function GameBoard(battleshipName) {
  const name = battleshipName;
  const ships = [];
  const coordinates = [[], [], [], [], [], [], [], [], [], []];
  const missedCoordinates = [];
  function getName() {
    return name;
  }
  function setName(newName) {
    name = newName;
  }
  function coordinatesAreInRange(shipCoordinates) {
    for (let i = 0; i < shipCoordinates.length; i += 1) {
      // eslint-disable-next-line prefer-destructuring
      const specificCoordinates = shipCoordinates[i];
      const [firstCoordinate, secondCoordinate] = specificCoordinates;
      if (
        // eslint-disable-next-line operator-linebreak
        firstCoordinate > 9 ||
        // eslint-disable-next-line operator-linebreak
        firstCoordinate < 0 ||
        // eslint-disable-next-line operator-linebreak
        secondCoordinate > 9 ||
        secondCoordinate < 0
      ) {
        return false;
      }
    }
    return true;
  }
  function noDuplicateCoordinates(shipCoordinates) {
    const newSet = new Set(
      // eslint-disable-next-line comma-dangle
      shipCoordinates.map((coordinate) => JSON.stringify(coordinate))
    );
    return newSet.size === shipCoordinates.length;
  }

  function coordinatesAreAllowed(shipCoordinates) {
    if (
      // eslint-disable-next-line operator-linebreak
      !coordinatesAreInRange(shipCoordinates) ||
      !noDuplicateCoordinates(shipCoordinates)
    ) {
      return false;
    }
    for (let i = 0; i < shipCoordinates.length; i += 1) {
      // eslint-disable-next-line prefer-destructuring
      const specificCoordinates = shipCoordinates[i];
      const [firstCoordinate, secondCoordinate] = specificCoordinates;
      if (coordinates[firstCoordinate][secondCoordinate]) return false;
    }
    return true;
  }
  function placeShip(...shipCoordinates) {
    if (!coordinatesAreAllowed(shipCoordinates)) return;
    const newShip = Ship(shipCoordinates.length);
    ships.push(newShip);
    for (let i = 0; i < shipCoordinates.length; i += 1) {
      // eslint-disable-next-line prefer-destructuring
      const specificCoordinates = shipCoordinates[i];
      const [firstCoordinate, secondCoordinate] = specificCoordinates;
      coordinates[firstCoordinate][secondCoordinate] = [newShip, i];
    }
  }
  function attackingCoordinateAreInRange(firstCoordinate, secondCoordinate) {
    if (
      // eslint-disable-next-line operator-linebreak
      firstCoordinate > 9 ||
      // eslint-disable-next-line operator-linebreak
      firstCoordinate < 0 ||
      // eslint-disable-next-line operator-linebreak
      secondCoordinate > 9 ||
      secondCoordinate < 0
    ) {
      return false;
    }
    return true;
  }
  function receiveAttack(firstCoordinate, secondCoordinate) {
    if (!attackingCoordinateAreInRange(firstCoordinate, secondCoordinate)) {
      return;
    }
    if (coordinates[firstCoordinate][secondCoordinate] === undefined) {
      missedCoordinates.push([firstCoordinate, secondCoordinate]);
    } else {
      const [ship, position] = coordinates[firstCoordinate][secondCoordinate];
      ship.hit(position);
    }
  }
  function allShipsAreSunk() {
    for (let i = 0; i < ships.length; i += 1) {
      if (!ships[i].isSunk()) {
        return false;
      }
    }
    return true;
  }

  function printShipToConsole() {
    let string = '';
    for (let i = 0; i < coordinates.length; i += 1) {
      for (let j = 0; j < coordinates.length; j += 1) {
        string += coordinates[i][j] ? 'X ' : 'O ';
      }
      string += '\n';
    }
    console.log(string);
  }
  function getRandomInt(num) {
    return Math.floor(Math.random() * num);
  }

  function checkHorizontalAvailability(
    [firstCoordinate, secondCoordinate],
    length
  ) {
    if (secondCoordinate + (length - 1) > 9) return false;
    for (let i = 0; i < length; i += 1) {
      if (coordinates[firstCoordinate][secondCoordinate + i]) {
        return false;
      }
    }
    return true;
  }

  function checkVerticalAvailability(
    [firstCoordinate, secondCoordinate],
    length
  ) {
    if (firstCoordinate + (length - 1) > 9) return false;
    for (let i = 0; i < length; i += 1) {
      if (coordinates[firstCoordinate + i][secondCoordinate]) {
        return false;
      }
    }
    return true;
  }
  function getCoordinates(coords, length, direction) {
    const arrayOfCoordinates = [];
    if (direction === 'Vertical') {
      for (let i = 0; i < length; i += 1) {
        arrayOfCoordinates.push([coords[0] + i, coords[1]]);
      }
    } else {
      for (let i = 0; i < length; i += 1) {
        arrayOfCoordinates.push([coords[0], coords[1] + i]);
      }
    }
    return arrayOfCoordinates;
  }
  function placeShipVertically([firstCoordinate, secondCoordinate], length) {
    const shipCoordinates = [];
    for (let i = 0; i < length; i += 1) {
      shipCoordinates.push([firstCoordinate + i, secondCoordinate]);
    }
    placeShip(...shipCoordinates);
  }
  function placeShipHorizontally([firstCoordinate, secondCoordinate], length) {
    const shipCoordinates = [];
    for (let i = 0; i < length; i += 1) {
      shipCoordinates.push([firstCoordinate, secondCoordinate + i]);
    }
    placeShip(...shipCoordinates);
  }
  function placeShipRandomly(length) {
    if (length > 10 || length <= 0) return;
    const direction =
      (getRandomInt(6) + 1) % 2 === 0 ? 'vertical' : 'horizontal';
    while (true) {
      const firstCoord = getRandomInt(10);
      const secondCoord = getRandomInt(10);
      if (direction === 'vertical') {
        if (!checkVerticalAvailability([firstCoord, secondCoord], length)) {
          continue;
        }
        placeShipVertically([firstCoord, secondCoord], length);
        break;
      } else {
        if (!checkHorizontalAvailability([firstCoord, secondCoord], length)) {
          continue;
        }
        placeShipHorizontally([firstCoord, secondCoord], length);
        break;
      }
    }
  }
  return {
    placeShip,
    missedCoordinates,
    coordinates,
    receiveAttack,
    allShipsAreSunk,
    printShipToConsole,
    placeShipRandomly,
    ships,
    coordinatesAreAllowed,
    getCoordinates,
    setName,
    getName,
  };
}
