import { BlindStatus } from "../Enums/BlindStatus";
import { IDevice } from "./IDevice";

export interface IBlinds extends IDevice {
	Status: BlindStatus;

	TurnUp(): void;
	TurnDown(): void;
	Toggle(): void;
}