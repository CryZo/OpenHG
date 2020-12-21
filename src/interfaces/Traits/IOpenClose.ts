import { BlindStatus } from "../../Enums/BlindStatus";
import { Device } from "../../Device";

export interface IOpenClose extends Device {
	MovementStatus: BlindStatus;

	TurnUp(): void;
	TurnDown(): void;
	Stop(): void;
}