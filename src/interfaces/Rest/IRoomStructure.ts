import { IDeviceStructure } from ".";
import { Trait } from "../../Enums";

export default interface IRoomStructure {
    id: string;
    Name: string;
    Floor: number;
    Devices: IDeviceStructure[];
    Traits: Trait[]

    Temperature?: number;
    Humidity?: number;
}