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
  getGameboard(){
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
    let safety = 0;
    while (true) {
      safety++;
      if (safety > 500) break;

      let allAttackedCells = this.attackResults.flatMap((entry) => entry[0]);
      let lastSuccessfullEntry;

      for (let i = this.attackResults.length - 1; i >= 0; i--) {
        if (this.attackResults[i][1] === true){
            lastSuccessfullEntry = this.attackResults[i];
            break;
        }
      }

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
          let rowOfNewAttack;
          let columnOfNewAttack;

          let randomInt = this.gameboard.getRandomInt(1, 4);

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
              rowOfNewAttack = lastRow;
              break;
            case 4:
              if (currentColumnInt !== 10) {
                columnOfNewAttack = currentColumnInt + 1;
              } else {
                columnOfNewAttack = currentColumnInt - 1;
              }
              rowOfNewAttack = lastRow;
          }
          let adjacentCellClass = rowOfNewAttack + columnOfNewAttack;

          if (allAttackedCells.includes(adjacentCellClass)) continue;
          let adjacentCellNode = enemyDomGameboard.querySelector(
            `.${adjacentCellClass}`
          );
          if (!adjacentCellNode) continue;
          adjacentCellNode.click();
          break;
        }
        else{
            const hasAttacked = this.doRandomAttack(enemyDomGameboard,allAttackedCells);
            if(hasAttacked)break;
            continue;
        }
      } else {
        const hasAttacked = this.doRandomAttack(enemyDomGameboard,allAttackedCells);
        if(hasAttacked)break;
        continue;
        
      }
    }
  }
  getLastSuccessfullEntry(){
    let lastSuccessfullEntry;
    if(!this.attackResults.length>0) return false;
      for (let i = this.attackResults.length - 1; i >= 0; i--) {
        if (this.attackResults[i][1] === true){
            return lastSuccessfullEntry = this.attackResults[i];
            
        }
      }
  }
  doRandomAttack(enemyDomGameboard,allAttackedCells){
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
