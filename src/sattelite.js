export class Sat {
    //current position
    //altitude
    //satname
    //class(unclassfied/classified)
    //groundtracks
    //leo/geo
    //type
    
    constructor (processedTLEString,altitude,name,clas,type,meshmat,velocity,selectedOrNot) {
        this.altitude = altitude;
        this.name = name;
        this.clas = clas;
        this.type = type;
        this.meshmat = meshmat;
        this.processedTLEString = processedTLEString;
        this.velocity = velocity;
        this.selectedOrNot = selectedOrNot;
    }
    get get_selectedOrNot(){
        return this.selectedOrNot;
    }
    get get_name(){
        return this.name;
    }
    get get_altitude(){
        return this.altitude;
    }
    get get_clas(){
        return this.clas;
    }
    get get_type(){
        return this.type;
    }
    get get_meshmat(){
        return this.meshmat;
    }
    get get_velocity(){
        return this.velocity;
    }
    get get_processedTLE(){
        return this.processedTLEString;
    }
    set set_meshmat(newMeshMat) {
        this.meshmat = newMeshMat;
    }
    set set_selectedOrNot(state){
        this.selectedOrNot = state;
    }

}