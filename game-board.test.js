import { Gameboard } from "./src/gameboard";
import { Ship } from "./src/ship";

let gameboard;

beforeEach(()=>{
    gameboard = new Gameboard;
})

test("Gameboard correctly places ships on coordinates",()=>{
    gameboard.setShipCoordinates(5,["A",2],["A",7]);
    expect(gameboard.placedShips).toContainEqual([expect.any(Ship),["A",2],["A",7]]);
    expect(gameboard.placedShips).not.toContainEqual([expect.any(Ship),["A",1],["A",7]]);
})

test("Gameboard doesn't place multiple ships on the same coordinates",()=>{
    gameboard.setShipCoordinates(5,["A",2],["A",7]);
    expect(gameboard.setShipCoordinates(5,["A",2],["B",7])).toBe(null);
    expect(gameboard.setShipCoordinates(5,["B",2],["B",7])).toBe(true);
})

