import Ship from './Ship';

export default function GameBoard() {
  const ships = [];
  const coordinates = [[], [], [], [], [], [], [], [], [], [], []];
  const missedCoordinates = [];
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
  return {
    placeShip,
    missedCoordinates,
    coordinates,
    receiveAttack,
    allShipsAreSunk,
  };
}
