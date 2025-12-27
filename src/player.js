import { Gameboard } from "./gameboard";
export class Player {
  gameboard;
  domGameboard;
  name;
  mode;
  attackResults = [];
  constructor(name) {
    this.gameboard = new Gameboard();
    this.name = name;
  }
  setDomGameboard(gameboard) {
    this.domGameboard = gameboard;
  }
  getDomGameboard() {
    return this.domGameboard;
  }
  getGameboard() {
    return this.gameboard;
  }
  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
  }
  setMode(keyword) {
    this.mode = keyword;
  }
  getMode() {
    return this.mode;
  }
  automatedAttack(enemyDomGameboard, enemyGameboard) {
    while (true) {
      let allAttackedCells = this.attackResults.map((entry) => entry[0]);
      const lastSuccessfulEntry = this.getCoordinateOfLastSuccessfulAttack();
      if (lastSuccessfulEntry) {
        let indexOfCurrentRow = this.gameboard.letters.indexOf(
          lastSuccessfulEntry[0][0],
        );
        let currentColumnInt = parseInt(lastSuccessfulEntry.slice(1), 10);

        if (
          enemyGameboard.getShipThatWasHit([
            enemyGameboard.letters[indexOfCurrentRow],
            currentColumnInt,
          ]) != enemyGameboard.getLastSunkShip()
        ) {
          const entriesOfLastHitShip =
            this.getAllSuccessfulEntriesOfLastHitShip(enemyGameboard);

          if (entriesOfLastHitShip.length >= 2) {
            const allEntries = entriesOfLastHitShip;
            const firstEntry = allEntries[0];
            const lastEntry = allEntries[allEntries.length - 1];
            const firstEntryAsArray = this.getCoordinateAsArray(firstEntry);
            const lastEntryAsArray = this.getCoordinateAsArray(lastEntry);

            while (true) {
              let randomInt = this.gameboard.getRandomInt(1, 2);
              let newCell;

              if (firstEntry[0] === lastEntry[0]) {
                //rows are same so need to move column
                switch (randomInt) {
                  case 1:
                    newCell = this.getCellAdjacentByOne(
                      3,
                      this.gameboard.letters.indexOf(firstEntryAsArray[0]),
                      firstEntryAsArray[1],
                    );
                    break;
                  case 2:
                    newCell = this.getCellAdjacentByOne(
                      4,
                      this.gameboard.letters.indexOf(lastEntryAsArray[0]),
                      lastEntryAsArray[1],
                    );
                    break;
                }
              } else {
                switch (randomInt) {
                  case 1:
                    newCell = this.getCellAdjacentByOne(
                      1,
                      this.gameboard.letters.indexOf(firstEntryAsArray[0]),
                      firstEntryAsArray[1],
                    );
                    break;
                  case 2:
                    newCell = this.getCellAdjacentByOne(
                      2,
                      this.gameboard.letters.indexOf(lastEntryAsArray[0]),
                      lastEntryAsArray[1],
                    );
                    break;
                }
              }
              if (allAttackedCells.includes(newCell)) continue;
              let newCellNode = enemyDomGameboard.querySelector(`.${newCell}`);
              if (!newCellNode) continue;
              newCellNode.click();
              break;
            }
            return;
          }
          while (true) {
            let randomInt = this.gameboard.getRandomInt(1, 4);
            let adjacentCellClass = this.getCellAdjacentByOne(
              randomInt,
              indexOfCurrentRow,
              currentColumnInt,
            );

            if (allAttackedCells.includes(adjacentCellClass)) continue;
            let adjacentCellNode = enemyDomGameboard.querySelector(
              `.${adjacentCellClass}`,
            );
            if (!adjacentCellNode) continue;
            adjacentCellNode.click();
            break;
          }
          return;
        }
      }
      const hasAttacked = this.doRandomAttack(
        enemyDomGameboard,
        allAttackedCells,
      );
      if (hasAttacked) break;
      continue;
    }
  }
  getLastSuccessfulEntry() {
    if (this.attackResults.length === 0) return false;
    for (let i = this.attackResults.length - 1; i >= 0; i--) {
      if (this.attackResults[i][1] === true) {
        return this.attackResults[i];
      }
    }
  }
  getCoordinateOfLastSuccessfulAttack() {
    let lastSuccessfulEntry = this.getLastSuccessfulEntry();
    if (!lastSuccessfulEntry) return false;
    return lastSuccessfulEntry[0];
  }
  getCoordinateAsArray(coordinate) {
    return [coordinate[0], parseInt(coordinate.slice(1), 10)];
  }
  getAllSuccessfulEntriesOfLastHitShip(enemyGameboard) {
    const lastSuccessfulAttack = this.getCoordinateOfLastSuccessfulAttack();
    if (!lastSuccessfulAttack) return [];
    const lastSuccessfulAttackAsAnArray =
      this.getCoordinateAsArray(lastSuccessfulAttack);
    const lastShipThatWasHit = enemyGameboard.getShipThatWasHit(
      lastSuccessfulAttackAsAnArray,
    );
    let allEntriesOfLastHitShip = [];

    this.attackResults.forEach((coordinate) => {
      if (
        enemyGameboard.getShipThatWasHit(
          this.getCoordinateAsArray(coordinate[0]),
        ) === lastShipThatWasHit
      ) {
        allEntriesOfLastHitShip.push(coordinate[0]);
      }
    });

    return this.sortEntries(allEntriesOfLastHitShip);
  }
  sortEntries(entries) {
    if (entries.length <= 1) return entries;
    let entriesAsArrays = [];
    entries.forEach((entry) => {
      entriesAsArrays.push(this.getCoordinateAsArray(entry));
    });
    if (entriesAsArrays[0][0] === entriesAsArrays[1][0]) {
      //rows are the same, so sort by column
      entriesAsArrays.sort((a, b) => a[1] - b[1]);
    } else {
      entriesAsArrays.sort();
    }
    return entriesAsArrays.map((entry) => {
      return entry[0] + entry[1];
    });
  }
  getCellAdjacentByOne(randomInt, indexOfCurrentRow, currentColumnInt) {
    let rowOfNewAttack;
    let columnOfNewAttack;
    switch (randomInt) {
      case 1:
        if (indexOfCurrentRow !== 0) {
          rowOfNewAttack = this.gameboard.letters[indexOfCurrentRow - 1];
        } else {
          rowOfNewAttack = this.gameboard.letters[indexOfCurrentRow + 1];
        }
        columnOfNewAttack = currentColumnInt;
        break;
      case 2:
        if (indexOfCurrentRow !== 9) {
          rowOfNewAttack = this.gameboard.letters[indexOfCurrentRow + 1];
        } else {
          rowOfNewAttack = this.gameboard.letters[indexOfCurrentRow - 1];
        }
        columnOfNewAttack = currentColumnInt;
        break;
      case 3:
        if (currentColumnInt !== 1) {
          columnOfNewAttack = currentColumnInt - 1;
        } else {
          columnOfNewAttack = currentColumnInt + 1;
        }
        rowOfNewAttack = this.gameboard.letters[indexOfCurrentRow];
        break;
      case 4:
        if (currentColumnInt !== 10) {
          columnOfNewAttack = currentColumnInt + 1;
        } else {
          columnOfNewAttack = currentColumnInt - 1;
        }
        rowOfNewAttack = this.gameboard.letters[indexOfCurrentRow];
    }
    return rowOfNewAttack + columnOfNewAttack;
  }
  doRandomAttack(enemyDomGameboard, allAttackedCells) {
    const randomColumnInt = this.gameboard.getRandomInt(1, 10);
    const randomRowInt = this.gameboard.getRandomInt(0, 9);
    const randomLetter = this.gameboard.letters[randomRowInt];
    let targetClass = randomLetter + randomColumnInt;
    let targetCell = enemyDomGameboard.querySelector(`.${targetClass}`);
    if (allAttackedCells.includes(targetClass)) return false;
    if (!targetCell) return false;
    targetCell.click();
    return true;
  }
}
