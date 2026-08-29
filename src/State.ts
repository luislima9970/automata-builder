

export class State {

    private id: number;
    private isAccepting: boolean;

    constructor(id: number,isAccepting : boolean = false){
        this.id = id;
        this.isAccepting = isAccepting;
    }


    setAcceptance(isAccepting : boolean) : void {
        this.isAccepting = isAccepting;
    }

    toggleAcceptance()  : void {
        this.isAccepting = !this.isAccepting;
    }

    getId() : number{
        return this.id;
    }

    getAcceptance() : boolean {
        return this.isAccepting;
    }



}