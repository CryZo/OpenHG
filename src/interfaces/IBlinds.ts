import { BlindStatus } from "../Enums/BlindStatus";
import { IDevice } from "./IDevice";

export interface IBlinds extends IDevice {
	Status: BlindStatus;
	Position: number;

	TurnUp(): void;
	TurnDown(): void;
	Stop(): void;

	SetPosition(pos: number): void;
}