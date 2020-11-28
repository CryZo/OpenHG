import { BlindStatus } from "../../Enums/BlindStatus";
import { IDevice } from "../DeviceTypes/IDevice";

export interface IOpenCloseStatus extends IDevice {
	Status: boolean;
}