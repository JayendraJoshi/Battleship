import { Gameboard } from "./gameboard";
export class Player{
gameboard;
domGameboard;
name;
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

}