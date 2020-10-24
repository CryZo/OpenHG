import { BlindStatus } from "../../Enums/BlindStatus";
import { IDevice } from "../DeviceTypes/IDevice";

export interface IOpenClose extends IDevice {
	MovementStatus: BlindStatus;

	TurnUp(): void;
	TurnDown(): void;
	Stop(): void;
}