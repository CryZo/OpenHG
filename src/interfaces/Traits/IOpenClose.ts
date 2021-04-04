import { BlindStatus } from "../../Enums";
import { Device } from "../../";

export default interface IOpenClose extends Device {
	MovementStatus: BlindStatus;

	TurnUp(): void;
	TurnDown(): void;
	Stop(): void;
}