import GameBoard from '../Gameboard';

let gameBoard;
beforeEach(() => {
  gameBoard = GameBoard();
});
describe('Gameboard', () => {
  test('Places ship on the correct coordinates', () => {
    expect(gameBoard.coordinates[0][0]).toBeUndefined();
    expect(gameBoard.coordinates[0][1]).toBeUndefined();
    expect(gameBoard.coordinates[0][2]).toBeUndefined();
    gameBoard.placeShip([0, 0], [0, 1], [0, 2]);
    expect(gameBoard.coordinates[0][0]).not.toBeUndefined();
    expect(gameBoard.coordinates[0][1]).not.toBeUndefined();
    expect(gameBoard.coordinates[0][2]).not.toBeUndefined();
  });
  test("Doesn't place a ship if one of the coordinates do not exist", () => {
    gameBoard.placeShip([-1, 0], [0, 0], [0, 1]);
    expect(gameBoard.coordinates[0][0]).toBeUndefined();
    expect(gameBoard.coordinates[0][1]).toBeUndefined();
    gameBoard.placeShip([0, 0], [1, 0], [10, 0]);
    expect(gameBoard.coordinates[0][0]).toBeUndefined();
    expect(gameBoard.coordinates[0][1]).toBeUndefined();
    gameBoard.placeShip([0, 0], [1, 0]);
    expect(gameBoard.coordinates[0][0]).not.toBeUndefined();
    expect(gameBoard.coordinates[1][0]).not.toBeUndefined();
  });
  test("Won't place the ship if there is already a ship in the coordinates", () => {
    gameBoard.placeShip([0, 0], [1, 0], [2, 0]);
    expect(gameBoard.coordinates[0][0]).not.toBeUndefined();
    expect(gameBoard.coordinates[1][0]).not.toBeUndefined();
    expect(gameBoard.coordinates[2][0]).not.toBeUndefined();
    gameBoard.placeShip([0, 0], [0, 1], [0, 2]);
    expect(gameBoard.coordinates[0][1]).toBeUndefined();
    expect(gameBoard.coordinates[0][2]).toBeUndefined();
  });
  test('Will not place the ship if given copies of the same coordinates', () => {
    gameBoard.placeShip([0, 0], [0, 0]);
    expect(gameBoard.coordinates[0][0]).toBeUndefined();
    gameBoard.placeShip([2, 0], [2, 0]);
    expect(gameBoard.coordinates[2][0]).toBeUndefined();
    gameBoard.placeShip([0, 0], [0, 1]);
    expect(gameBoard.coordinates[0][0]).not.toBeUndefined();
  });
  test('Will record the coordinates of the missed shots', () => {
    gameBoard.placeShip([1, 0], [2, 0], [3, 0]);
    gameBoard.receiveAttack(0, 0);
    expect(gameBoard.missedCoordinates[0]).toEqual([0, 0]);
    gameBoard.receiveAttack(4, 0);
    expect(gameBoard.missedCoordinates[1]).toEqual([4, 0]);
  });
  test('The Gameboard is able to pass the coordinates of a hit to the appropriate ship', () => {
    gameBoard.placeShip([9, 0], [9, 1], [9, 2]);
    gameBoard.receiveAttack(9, 0);
    expect(gameBoard.coordinates[9][0][0].isHit(0)).toBe(true);
    expect(gameBoard.coordinates[9][1][0].isHit(1)).toBe(false);
  });
  test('Gameboard is able to pass the correct coordinates of a hit multiple times', () => {
    gameBoard.placeShip([5, 0], [6, 0], [7, 0], [8, 0]);
    gameBoard.receiveAttack(5, 0);
    gameBoard.receiveAttack(6, 0);
    gameBoard.receiveAttack(7, 0);
    gameBoard.receiveAttack(8, 0);
    expect(gameBoard.coordinates[5][0][0].isSunk()).toBe(true);
  });
  test("Gameboard is able to know when all of it's ships are sunk with just one ship", () => {
    gameBoard.placeShip([3, 0], [3, 1], [3, 2]);
    gameBoard.receiveAttack(3, 0);
    gameBoard.receiveAttack(3, 1);
    expect(gameBoard.allShipsAreSunk()).toBe(false);
    gameBoard.receiveAttack(3, 2);
    expect(gameBoard.allShipsAreSunk()).toBe(true);
  });

  test("Gameboard is able to know when all of it's ships are sunk with multiple ships", () => {
    gameBoard.placeShip([0, 0], [0, 1], [0, 2]);
    gameBoard.placeShip([1, 0], [2, 0], [3, 0]);
    gameBoard.receiveAttack(0, 0);
    gameBoard.receiveAttack(0, 1);
    gameBoard.receiveAttack(0, 2);
    expect(gameBoard.coordinates[0][0][0].isSunk()).toBe(true);
    expect(gameBoard.coordinates[1][0][0].isSunk()).toBe(false);
    expect(gameBoard.allShipsAreSunk()).toBe(false);
    gameBoard.receiveAttack(1, 0);
    gameBoard.receiveAttack(2, 0);
    gameBoard.receiveAttack(3, 0);
    expect(gameBoard.coordinates[1][0][0].isSunk()).toBe(true);
    expect(gameBoard.allShipsAreSunk()).toBe(true);
  });
  test('Gameboard is able to randomly place a ship', () => {
    gameBoard.placeShipRandomly(5);
    gameBoard.placeShipRandomly(4);
    gameBoard.placeShipRandomly(3);
    gameBoard.placeShipRandomly(2);
    gameBoard.placeShipRandomly(1);
    gameBoard.printShipToConsole();
    expect(gameBoard.ships.length).toBe(5);
  });
  test('getCoordinates function works properly', () => {
    expect(gameBoard.getCoordinates([0, 0], 2, 'Vertical')).toEqual([
      [0, 0],
      [1, 0],
    ]);
  });
});
