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
  setMode(keyword) {
    this.mode = keyword;
  }
  getMode() {
    return this.mode;
  }
  automatedAttack(enemyDomGameboard, enemyGameboard) {
    while (true) {
      let allAttackedCells = this.attackResults.map((entry) => entry[0]);
      let lastSuccessfullEntry = this.getLastSuccessfulEntry();

      if (lastSuccessfullEntry) {
        let indexOfCurrentRow = this.gameboard.letters.indexOf(
          lastSuccessfullEntry[0][0]
        );
        let currentColumnInt = parseInt(lastSuccessfullEntry[0].slice(1), 10);
        const lastCoordinate = lastSuccessfullEntry[0];
        const lastRow = lastCoordinate[0];

        if (
          enemyGameboard.getShipThatWasHit([
            enemyGameboard.letters[indexOfCurrentRow],
            currentColumnInt,
          ]) != enemyGameboard.getLastSunkShip()
        ) {
          let safety = 4;
          while (true) {
            safety--;
            if (safety == 0) break;

            let randomInt = this.gameboard.getRandomInt(1, 4);
            let adjacentCellClass = this.getCellAdjacentByOne(randomInt,indexOfCurrentRow,currentColumnInt);
       
            if (allAttackedCells.includes(adjacentCellClass)) continue;
            let adjacentCellNode = enemyDomGameboard.querySelector(
              `.${adjacentCellClass}`
            );
            if (!adjacentCellNode) continue;
            adjacentCellNode.click();
            return;
          }
          safety = 4;
          while(true){
            safety--;
            if (safety == 0) break;
            let randomInt = this.gameboard.getRandomInt(1, 4);
             let adjacentCellClass = this.getCellAdjacentByTwo(randomInt,indexOfCurrentRow,currentColumnInt);
             if (allAttackedCells.includes(adjacentCellClass)) continue;
            let adjacentCellNode = enemyDomGameboard.querySelector(
              `.${adjacentCellClass}`
            );
            if (!adjacentCellNode) continue;
            adjacentCellNode.click();
            return;
          }
        } 
      } 
      const hasAttacked = this.doRandomAttack(
        enemyDomGameboard,
        allAttackedCells
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
  getCellAdjacentByOne(randomInt,indexOfCurrentRow,currentColumnInt){
    let rowOfNewAttack;
    let columnOfNewAttack;
    switch (randomInt) {
              case 1:
                if (indexOfCurrentRow !== 0) {
                  rowOfNewAttack =
                    this.gameboard.letters[indexOfCurrentRow - 1];
                } else {
                  rowOfNewAttack =
                    this.gameboard.letters[indexOfCurrentRow + 1];
                }
                columnOfNewAttack = currentColumnInt;
                break;
              case 2:
                if (indexOfCurrentRow !== 9) {
                  rowOfNewAttack =
                    this.gameboard.letters[indexOfCurrentRow + 1];
                } else {
                  rowOfNewAttack =
                    this.gameboard.letters[indexOfCurrentRow - 1];
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
            return  rowOfNewAttack + columnOfNewAttack;
  }
  getCellAdjacentByTwo(randomInt,indexOfCurrentRow,currentColumnInt){
     let rowOfNewAttack;
    let columnOfNewAttack;
    switch (randomInt) {
              case 1:
                if (indexOfCurrentRow !== 0 && indexOfCurrentRow!== 1) {
                  rowOfNewAttack =
                    this.gameboard.letters[indexOfCurrentRow - 2];
                } else {
                  rowOfNewAttack =
                    this.gameboard.letters[indexOfCurrentRow + 2];
                }
                columnOfNewAttack = currentColumnInt;
                break;
              case 2:
                if (indexOfCurrentRow !== 9 && indexOfCurrentRow !== 8) {
                  rowOfNewAttack =
                    this.gameboard.letters[indexOfCurrentRow + 2];
                } else {
                  rowOfNewAttack =
                    this.gameboard.letters[indexOfCurrentRow - 2];
                }
                columnOfNewAttack = currentColumnInt;
                break;
              case 3:
                if (currentColumnInt !== 1 && currentColumnInt !==2) {
                  columnOfNewAttack = currentColumnInt - 2;
                } else {
                  columnOfNewAttack = currentColumnInt + 2;
                }
                rowOfNewAttack = this.gameboard.letters[indexOfCurrentRow];
                break;
              case 4:
                if (currentColumnInt !== 10 && currentColumnInt !==9) {
                  columnOfNewAttack = currentColumnInt + 2;
                } else {
                  columnOfNewAttack = currentColumnInt - 2;
                }
                rowOfNewAttack = this.gameboard.letters[indexOfCurrentRow];
            }
            return  rowOfNewAttack + columnOfNewAttack;
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
