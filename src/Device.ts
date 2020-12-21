import { Trait } from "./Enums/Trait";
import { DeviceType } from "./Enums/DeviceType";
import { EventEmitter } from 'events'

export class Device extends EventEmitter {
    constructor() {
        super();
    }

    Name: string;
    _id: string;
    Type: DeviceType;
    Traits: Trait[];
    AllowAutomation = true;
    
    Run(): void {}

    aog_Type: string = '';
    aog_Traits: string[] = [];
    aog_Attributes: any;
}