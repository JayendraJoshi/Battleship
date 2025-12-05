import { Gameboard } from "./gameboard";
export class Player{
gameboard;
playerType;
constructor(playerType){
    this.gameboard = new Gameboard();
    this.playerType = playerType;
}    

}