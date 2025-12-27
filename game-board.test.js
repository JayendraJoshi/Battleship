import { Gameboard } from "./src/gameboard";
import { Ship } from "./src/ship";

let gameboard;

beforeEach(() => {
  gameboard = new Gameboard();
});

test("Gameboard correctly places ships on coordinates", () => {
  gameboard.setShip(5, ["A", 2], ["A", 7]);
  expect(gameboard.placedShips).toContainEqual([
    expect.any(Ship),
    [
      ["A", 2],
      ["A", 3],
      ["A", 4],
      ["A", 5],
      ["A", 6],
      ["A", 7],
    ],
  ]);
  expect(gameboard.placedShips).not.toContainEqual([
    expect.any(Ship),
    [
      ["A", 1],
      ["A", 3],
      ["A", 4],
      ["A", 5],
      ["A", 6],
      ["A", 7],
    ],
  ]);
});

test("Gameboard doesn't place multiple ships on the same coordinates", () => {
  gameboard.setShip(5, ["A", 2], ["A", 7]);
  expect(gameboard.setShip(5, ["A", 2], ["D", 2])).toBe(null);
  expect(gameboard.setShip(5, ["B", 2], ["E", 2])).toBe(true);
});

test("Receive attack function returns true when it hit a ship, false when it missed and null if the coordinate was already shot", () => {
  gameboard.setShip(5, ["A", 2], ["A", 7]);
  expect(gameboard.receiveAttack(["A", 2])).toBe(true);
  expect(gameboard.receiveAttack(["B", 2])).toBe(false);
  expect(gameboard.receiveAttack(["A", 2])).toBe(null);
});

test("Gameboard reports when all ships have been sunk", () => {
  gameboard.setShip(2, ["A", 1], ["A", 2]);
  gameboard.receiveAttack(["A", 1]);
  gameboard.receiveAttack(["A", 2]);
  expect(gameboard.haveAllShipsBeenSunk()).toBe(true);
  gameboard.setShip(3, ["B", 1], ["B", 3]);
  expect(gameboard.haveAllShipsBeenSunk()).toBe(false);
});

test("Gameboard reports if the last attack has sunk a ship", () => {
  gameboard.setShip(2, ["A", 1], ["A", 2]);
  gameboard.receiveAttack(["A", 1]);
  gameboard.receiveAttack(["A", 2]);
  expect(gameboard.hasLastAttackSunkAShip()).toBe(true);
});

test("Gameboard returns last sunk ship", () => {
  gameboard.setShip(2, ["A", 1], ["A", 2], "Patrol Boat");
  gameboard.receiveAttack(["A", 1]);
  gameboard.receiveAttack(["A", 2]);
  expect(gameboard.getLastSunkShip().name).toBe("Patrol Boat");
});

test("Gameboard sets all ships randomly", () => {
  gameboard.setShipsRandomly();
  expect(gameboard.placedShips.length).toBe(5);
  const allShips = gameboard.placedShips.flatMap((shipEntry) => shipEntry[0]);
  const shipLengths = allShips.map((ship) => ship.length);
  expect(
    shipLengths.filter(
      (value, index, self) => self.indexOf(value) === self.lastIndexOf(value),
    ),
  ).toEqual([2, 4, 5]);
  expect(shipLengths.filter((value) => value === 3).length).toBe(2);
});

test("Gameboard reports whether coordinates are out of bounds or not", () => {
  let shipPath = gameboard.getShipPath(["A", 10], ["A", 13]);
  expect(gameboard.areCoordinatesWithinBounds(shipPath)).toBe(false);
});
