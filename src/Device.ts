import { Room } from "./";
import { DeviceType, Trait } from "./Enums/";
import { EventEmitter } from 'events'

export default class Device extends EventEmitter {
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
}