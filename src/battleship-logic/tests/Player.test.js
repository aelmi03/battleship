import Player from '../Player';

let firstPlayer;
let secondPlayer;
beforeEach(() => {
  firstPlayer = Player('Player 1');
  secondPlayer = Player('Player 2');
});
describe('Player', () => {
  test('Player is able to properly get and set their name', () => {
    expect(firstPlayer.getName()).toBe('Player 1');
    firstPlayer.setName('First Player');
    expect(firstPlayer.getName()).toBe('First Player');
  });
  test('Player is able to properly attack a ship', () => {
    secondPlayer.gameBoard.placeShip([0, 0], [0, 1], [0, 2]);
    firstPlayer.attack([0, 0], secondPlayer.gameBoard);
    expect(secondPlayer.gameBoard.coordinates[0][0][0].isHit(0)).toBe(true);
    expect(secondPlayer.gameBoard.coordinates[0][0][0].isHit(1)).toBe(false);
    firstPlayer.attack([0, 1], secondPlayer.gameBoard);
    firstPlayer.attack([0, 2], secondPlayer.gameBoard);
    expect(secondPlayer.gameBoard.allShipsAreSunk()).toBe(true);
  });
  test('Player is able to record their attacks and will not record duplicates', () => {
    secondPlayer.gameBoard.placeShip([2, 0], [2, 1], [2, 2]);
    firstPlayer.attack([2, 0], secondPlayer.gameBoard);
    firstPlayer.attack([2, 0], secondPlayer.gameBoard);
    expect(firstPlayer.attacks.length).toBe(1);
    firstPlayer.randomAttack(secondPlayer.gameBoard);
    expect(firstPlayer.attacks.length).toBe(2);
  });
  test('Player is able to randomly attack an enemy ship properly', () => {
    secondPlayer.gameBoard.placeShip([0, 0], [0, 1], [0, 2]);
    secondPlayer.gameBoard.placeShip([1, 0], [2, 0], [3, 0]);
    secondPlayer.gameBoard.placeShip([4, 0], [5, 0], [6, 0]);
    secondPlayer.gameBoard.placeShip([7, 0], [7, 1], [7, 2]);
    secondPlayer.gameBoard.placeShip([9, 7], [9, 8], [9, 9]);
    for (let i = 0; i < 100; i += 1) {
      firstPlayer.randomAttack(secondPlayer.gameBoard);
    }
    expect(secondPlayer.gameBoard.allShipsAreSunk()).toBe(true);
  });
});
