import { BlindStatus } from "../../Enums/BlindStatus";
import { IDevice } from "../DeviceTypes/IDevice";

export interface IOpenClose extends IDevice {
	MovementStatus: BlindStatus;
	Position: number;

	TurnUp(): void;
	TurnDown(): void;
	Stop(): void;

	SetPosition(pos: number): void;
}