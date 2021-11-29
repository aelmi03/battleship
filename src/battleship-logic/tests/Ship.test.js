import Ship from '../Ship';

describe('Ship', () => {
  test('Creates a ship with the length specified in the constructor', () => {
    const battleShip = Ship(5);
    expect(battleShip.length).toBe(5);
  });
  test('A negative length in the constructor should simply return null', () => {
    const battleShip = Ship(-2);
    expect(battleShip).toBe(null);
  });
  test('A length of 0 should also return null', () => {
    const battleShip = Ship(0);
    expect(battleShip).toBe(null);
  });
  test('Marks the proper position as hit', () => {
    const battleShip = Ship(2);
    battleShip.hit(0);
    expect(battleShip.isHit(0)).toBe(true);
    expect(battleShip.isHit(1)).toBe(false);
    expect(battleShip.hits).toEqual([0]);
  });
  test("Hit doesn't mark a position that does not exist as hit", () => {
    const battleShip = Ship(3);
    battleShip.hit(4);
    expect(battleShip.hits).toEqual([]);
    battleShip.hit(2);
    expect(battleShip.hits).toEqual([2]);
  });
  test('Ship doesn`t mark the same position as hit multiple times', () => {
    const battleShip = Ship(3);
    battleShip.hit(0);
    battleShip.hit(0);
    expect(battleShip.isHit(0)).toBe(true);
    expect(battleShip.hits).toEqual([0]);
  });
  test('The Ship will be sunk if all of its positions are hit', () => {
    const battleShip = Ship(3);
    battleShip.hit(0);
    battleShip.hit(1);
    expect(battleShip.isSunk()).toBe(false);
    battleShip.hit(2);
    expect(battleShip.isSunk()).toBe(true);
  });
  test("A ship with a length of 1 will sink if it's only position is hit", () => {
    const battleShip = Ship(1);
    expect(battleShip.isSunk()).toBe(false);
    battleShip.hit(1);
    expect(battleShip.isSunk()).toBe(false);
    battleShip.hit(0);
    expect(battleShip.isSunk()).toBe(true);
  });
});
