import { Ship } from "./ship";
export class Gameboard{

    missedAttacks = [];
    successfulAttacks = [];
    placedShips = [];
    sunkShips = [];
    board;
    constructor(){
        this.board =  {
        "A": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "B": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "C": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "D": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "E": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "F": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "G": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "H": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "I": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ],
        "J": [ [1], [2], [3], [4], [5], [6], [7], [8], [9], [10] ]
        }
    }
    setShip(shipLength,[startRow,startColumn],[endRow,endColumn],name){
        if(!this.AreCoordinatesAvailable([startRow,startColumn],[endRow,endColumn])) return null;
        let shipPath = this.getShipPath([startRow,startColumn],[endRow,endColumn]);
        const ship = new Ship(shipLength);
        ship.setName(name);
        this.placedShips.push([ship,shipPath]);
        return true;
    }
    AreCoordinatesAvailable([startRow,startColumn],[endRow,endColumn]){
        if(startRow !== endRow && startColumn !== endColumn) return false;
        let shipPath = this.getShipPath([startRow,startColumn],[endRow,endColumn]);
        if(this.isAnyCoordinateOfPathTaken(shipPath)) return false;
        return true;
    }
    getShipPath([startRow,startColumn],[endRow,endColumn]){
        if(startRow === endRow){
            let smallerColumn;
            let largerColumn;
            if(startColumn<endColumn) {
                smallerColumn = startColumn;
                largerColumn = endColumn;
            }else{
                smallerColumn = endColumn;
                largerColumn = startColumn;
            }
            return this.getShipColumnPath(smallerColumn,largerColumn,startRow);
        }else{
            let smallerRow;
            let largerRow;
            const letters = ["A","B","C","D","E","F","G","H","I","J"];

            if(startRow< endRow){
                smallerRow = startRow;
                largerRow = endRow;
            }else{
                smallerRow = endRow;
                largerRow = startRow;
            }
            let indexOfSmallerRow = letters.indexOf(smallerRow);
            let indexOfLargerRow = letters.indexOf(largerRow);
            return this.getShipRowPath(letters,indexOfSmallerRow,indexOfLargerRow,startColumn)
        }
    }
    getShipRowPath(letters,indexOfSmallerRow,indexOfLargerRow,column){
        let shipPath = [];   
        for(let i = indexOfSmallerRow;i<= indexOfLargerRow;i++){
                shipPath.push([letters[i],column]);
            }
            return shipPath;
    }
    getShipColumnPath(smallerColumn,largerColumn,row){ 
        let shipPath = [];
            for(let i = smallerColumn;i<=largerColumn;i++){
                shipPath.push([row,i]);
            }
            return shipPath;
    }
    isAnyCoordinateOfPathTaken(shipPath){
        for(let i = 0; i< shipPath.length;i++){
            if(this.isCoordinateTakenByAShip(shipPath[i]) || this.wasTheCoordinateShotAlready(shipPath[i])){
                return true;
            }
        }
    }
    isCoordinateTakenByAShip([row, column]){
        return this.placedShips
            .flatMap((ship) => ship[1])
            .some(coord => coord[0] === row && coord[1] === column);
    }
    receiveAttack([row,column]){
        if(this.wasTheCoordinateShotAlready([row,column]))return null;
        else if(this.isCoordinateTakenByAShip([row,column])){
           let ship = this.getShipThatWasHit([row,column]);
           ship.hit();
           this.successfulAttacks.push([row,column]);
           if(ship.isSunk()){
            this.sunkShips.push(ship);
           }
           return true;
        }else{
            this.missedAttacks.push([row,column]);
             return false;
        }
    }
    wasTheCoordinateShotAlready([row, column]){
        return this.missedAttacks
        .some(attack => attack[0]===row && attack[1] === column) ||
        this.successfulAttacks
        .some(attack => attack[0]===row && attack[1] === column);
    }
    getShipThatWasHit([row, column]){
        const placedShipEntry = this.placedShips
        .find(ship => ship[1].some(coordinate => coordinate[0]===row && coordinate[1] === column));
        return placedShipEntry[0];
    }
    haveAllShipsBeenSunk(){
        const allShipCoordinates = this.placedShips.flatMap(ship => ship[1]);

        return allShipCoordinates.every(coordinate => this.successfulAttacks
            .some(attack => attack[0] === coordinate[0] && attack[1] === coordinate[1]));
    }
    hasLastAttackSunkAShip(){
        const lastSuccessfulAttack = this.successfulAttacks[this.successfulAttacks.length-1];
        const shipThatWasHit = this.getShipThatWasHit(lastSuccessfulAttack);
        return shipThatWasHit.isSunk();
    }
    getLastSunkShip(){
        return this.sunkShips[this.sunkShips.length-1];
    }

}