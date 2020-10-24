import { Trait } from "../../Enums/Trait";
import { DeviceType } from "../../Enums/DeviceType";

export interface IDevice {
    Name: string;
    _id: string;
    Type: DeviceType;
    Traits: Trait[]
    
    Run(): void;

    aog_Type: string;
    aog_Traits: string[];
    aog_Attributes: any;
}