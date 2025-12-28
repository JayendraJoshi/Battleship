import { Ship } from "../src/ship";

let ship;

beforeEach(() => {
  ship = new Ship(5);
});

test("Ships have length and numberOfHits property", () => {
  expect(ship).toHaveProperty("length");
  expect(ship).toHaveProperty("numberOfHits");
});

test("Hit function increases numberOfHits property", () => {
  let numberOfHitsOld = ship.numberOfHits;
  ship.hit();
  expect(ship.numberOfHits).toBe(numberOfHitsOld + 1);
});

test("IsSunk function returns only true when numberofHits equal length", () => {
  for (let i = 0; i < ship.length - 1; i++) {
    ship.hit();
    expect(ship.isSunk()).toBe(false);
  }
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
