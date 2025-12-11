import { Gameboard } from "./gameboard";
export class Player{
gameboard;
domGameboard;
playerType;
constructor(playerType){
    this.gameboard = new Gameboard();
    this.playerType = playerType;
}    
setDomGameboard(gameboard){
    this.domGameboard = gameboard;
}
getDomGameboard(){
    return this.domGameboard;
}

}