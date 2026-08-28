

export class State {

    private id: string;
    private isAccepting: boolean;

    constructor(id: string,isAccepting : boolean = false){
        this.id = id;
        this.isAccepting = isAccepting;
    }

    setName(name : string) : void {
        this.id = name;
    }

    changeAcceptance(isAccepting : boolean) : void {
        this.isAccepting = isAccepting;
    }

    toggleAcceptance()  : void {
        this.isAccepting = !this.isAccepting;
    }

    getId() : string{
        return this.id;
    }

    getAcceptance() : boolean {
        return this.isAccepting;
    }



}