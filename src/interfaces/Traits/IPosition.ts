import { BlindStatus } from "../../Enums/BlindStatus";
import { IDevice } from "../DeviceTypes/IDevice";

export interface IOpenClose extends IDevice {
	Position: number;

	SetPosition(pos: number): void;
}