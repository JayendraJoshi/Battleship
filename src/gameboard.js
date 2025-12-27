import { Ship } from "./ship";
export class Gameboard {
  missedAttacks = [];
  successfulAttacks = [];
  placedShips = [];
  sunkShips = [];
  board;
  letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  constructor() {
    this.board = {
      A: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
      B: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
      C: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
      D: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
      E: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
      F: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
      G: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
      H: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
      I: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
      J: [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]],
    };
  }
  setShip(shipLength, [startRow, startColumn], [endRow, endColumn], name) {
    if (
      !this.areCoordinatesAvailable(
        [startRow, startColumn],
        [endRow, endColumn],
      )
    )
      return null;
    let shipPath = this.getShipPath(
      [startRow, startColumn],
      [endRow, endColumn],
    );
    const ship = new Ship(shipLength);
    ship.setName(name);
    this.placedShips.push([ship, shipPath]);
    return true;
  }
  areCoordinatesAvailable([startRow, startColumn], [endRow, endColumn]) {
    if (startRow !== endRow && startColumn !== endColumn) return false;
    let shipPath = this.getShipPath(
      [startRow, startColumn],
      [endRow, endColumn],
    );
    if (!this.areCoordinatesWithinBounds(shipPath)) return false;
    if (this.isAnyCoordinateOfPathTaken(shipPath)) return false;
    return true;
  }
  getShipPath([startRow, startColumn], [endRow, endColumn]) {
    if (startRow === endRow) {
      let smallerColumn;
      let largerColumn;
      if (startColumn < endColumn) {
        smallerColumn = startColumn;
        largerColumn = endColumn;
      } else {
        smallerColumn = endColumn;
        largerColumn = startColumn;
      }
      return this.getShipColumnPath(smallerColumn, largerColumn, startRow);
    } else {
      let smallerRow;
      let largerRow;

      if (startRow < endRow) {
        smallerRow = startRow;
        largerRow = endRow;
      } else {
        smallerRow = endRow;
        largerRow = startRow;
      }
      let indexOfSmallerRow = this.letters.indexOf(smallerRow);
      let indexOfLargerRow = this.letters.indexOf(largerRow);
      return this.getShipRowPath(
        indexOfSmallerRow,
        indexOfLargerRow,
        startColumn,
      );
    }
  }
  getShipRowPath(indexOfSmallerRow, indexOfLargerRow, column) {
    let shipPath = [];
    for (let i = indexOfSmallerRow; i <= indexOfLargerRow; i++) {
      shipPath.push([this.letters[i], column]);
    }
    return shipPath;
  }
  getShipColumnPath(smallerColumn, largerColumn, row) {
    let shipPath = [];
    for (let i = smallerColumn; i <= largerColumn; i++) {
      shipPath.push([row, i]);
    }
    return shipPath;
  }
  isAnyCoordinateOfPathTaken(shipPath) {
    for (let i = 0; i < shipPath.length; i++) {
      if (
        this.isCoordinateTakenByAShip(shipPath[i]) ||
        this.wasTheCoordinateShotAlready(shipPath[i])
      ) {
        return true;
      }
    }
    return false;
  }
  isCoordinateTakenByAShip([row, column]) {
    return this.placedShips
      .flatMap((ship) => ship[1])
      .some((coord) => coord[0] === row && coord[1] === column);
  }
  receiveAttack([row, column]) {
    if (this.wasTheCoordinateShotAlready([row, column])) return null;
    else if (this.isCoordinateTakenByAShip([row, column])) {
      let ship = this.getShipThatWasHit([row, column]);
      ship.hit();
      this.successfulAttacks.push([row, column]);
      if (ship.isSunk()) {
        this.sunkShips.push(ship);
      }
      return true;
    } else {
      this.missedAttacks.push([row, column]);
      return false;
    }
  }
  wasTheCoordinateShotAlready([row, column]) {
    return (
      this.missedAttacks.some(
        (attack) => attack[0] === row && attack[1] === column,
      ) ||
      this.successfulAttacks.some(
        (attack) => attack[0] === row && attack[1] === column,
      )
    );
  }
  getShipThatWasHit([row, column]) {
    const placedShipEntry = this.placedShips.find((ship) =>
      ship[1].some(
        (coordinate) => coordinate[0] === row && coordinate[1] === column,
      ),
    );
    return placedShipEntry ? placedShipEntry[0] : null;
  }
  haveAllShipsBeenSunk() {
    const allShipCoordinates = this.placedShips.flatMap((ship) => ship[1]);

    return allShipCoordinates.every((coordinate) =>
      this.successfulAttacks.some(
        (attack) => attack[0] === coordinate[0] && attack[1] === coordinate[1],
      ),
    );
  }
  hasLastAttackSunkAShip() {
    const lastSuccessfulAttack =
      this.successfulAttacks[this.successfulAttacks.length - 1];
    const shipThatWasHit = this.getShipThatWasHit(lastSuccessfulAttack);
    return shipThatWasHit.isSunk();
  }
  getLastSunkShip() {
    return this.sunkShips[this.sunkShips.length - 1];
  }
  setShipsRandomly() {
    if (this.placedShips.length != 0) this.placedShips = [];
    for (let i = 2; i < 6; i++) {
      let shipPath = this.getRandomAvailableShipPath(i);
      const ship = new Ship(i);
      ship.setName(this.getShipNameFromLength(i));
      this.placedShips.push([ship, shipPath]);
      if (i === 3) {
        let shipPath = this.getRandomAvailableShipPath(i);
        const ship = new Ship(i);
        ship.setName(this.getShipNameFromLength(i, "S"));
        this.placedShips.push([ship, shipPath]);
      }
    }
  }
  getRandomAvailableShipPath(length) {
    let shipPath;
    while (true) {
      let startRow;
      let startColumn;
      let randomIntForStartRow;
      let randomIntForStartColumn;

      //Randomize whether the ship will be placed along x or y axis
      let randomPlacementInt = this.getRandomInt(1, 2);
      if (randomPlacementInt === 1) {
        //Row changes
        randomIntForStartRow = this.getRandomInt(0, 10 - length);
        startRow = randomIntForStartRow;
        startColumn = this.getRandomInt(1, 10);

        shipPath = this.getShipRowPath(
          startRow,
          startRow + length - 1,
          startColumn,
        );
      } else if (randomPlacementInt === 2) {
        //Column changes
        randomIntForStartColumn = this.getRandomInt(1, 11 - length);
        startColumn = randomIntForStartColumn;
        startRow = this.letters[this.getRandomInt(0, 9)];

        shipPath = this.getShipColumnPath(
          startColumn,
          startColumn + length - 1,
          startRow,
        );
      }

      //check whether the shipPath is available
      if (
        this.isAnyCoordinateOfPathTaken(shipPath) ||
        !this.areCoordinatesWithinBounds(shipPath)
      )
        continue;
      break;
    }
    return shipPath;
  }
  getShipNameFromLength(length, variant = "") {
    switch (length) {
      case 2:
        return "Patrol Boat";
      case 3:
        if (variant == "S") return "Submarine";
        return "Destroyer";
      case 4:
        return "Battleship";
      case 5:
        return "Carrier";
    }
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  areCoordinatesWithinBounds(shipPath) {
    return shipPath.every(
      (coordinatePair) =>
        coordinatePair[0] >= "A" &&
        coordinatePair[0] <= "J" &&
        coordinatePair[1] >= 1 &&
        coordinatePair[1] <= 10,
    );
  }
}
