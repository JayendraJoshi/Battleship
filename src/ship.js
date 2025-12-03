export class Ship{

length;
numberOfHits = 0;

constructor(length){
    this.length = length;
}

hit(){
    this.numberOfHits++;
}
isSunk(){
    if(this.numberOfHits === this.length){
        return true;
    }
    else{
        return false;
    }
}

}