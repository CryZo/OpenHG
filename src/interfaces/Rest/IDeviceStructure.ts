import { BlindStatus, DeviceType, Trait } from "../../Enums";

export default interface IDeviceStructure {
    id: string;
    Name: string;
    Type: DeviceType;
    Traits: Trait[];

    Status?: boolean;
    Color?: string;
    Brightness?: number;
    MovementStatus?: BlindStatus;
    Position?: number;
    TargetTemperature?: number;
    Temperature?: number;
    Humidity?: number;
    Power?: number;
    Energy?: number;
}