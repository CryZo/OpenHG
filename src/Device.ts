import { Trait } from "./Enums/Trait";
import { DeviceType } from "./Enums/DeviceType";
import { EventEmitter } from 'events'
import { Room } from "./Room";

export class Device extends EventEmitter {
    constructor() {
        super();
    }

    Name: string;
    _id: string;
    Type: DeviceType;
    Traits: Trait[];
    AllowAutomation = true;
    Room: Room;
    
    Run(): void {}

    aog_Type: string = '';
    aog_Traits: string[] = [];
    aog_Attributes: any;
}