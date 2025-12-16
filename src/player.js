import { Gameboard } from "./gameboard";
export class Player{
gameboard;
domGameboard;
name;
mode;
attackResults = [];
constructor(name){
    this.gameboard = new Gameboard();
    this.name = name;
}    
setDomGameboard(gameboard){
    this.domGameboard = gameboard;
}
getDomGameboard(){
    return this.domGameboard;
}
getName(){
    return this.name
}
setMode(keyword){
    this.mode = keyword;
}
getMode(){
    return this.mode;
}
automatedAttack(enemyDomGameboard){
    while(true){
        const randomColumnInt = this.gameboard.getRandomInt(1,10);
        const randomRowInt = this.gameboard.getRandomInt(0,9);
        const randomLetter = this.gameboard.letters[randomRowInt];
        let targetClass = randomLetter+randomColumnInt;
        let targetCell = enemyDomGameboard.querySelector(`.${targetClass}`);
        let allAttackedCells = this.attackResults.flatMap(entry => entry[0]);
        if(allAttackedCells.includes(targetClass)) continue;
        targetCell.click();
        break;
    }
}

}