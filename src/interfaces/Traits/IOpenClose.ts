import { BlindStatus } from "../../Enums";
import { Device } from "../../";

export default interface IOpenClose extends Device {
	MovementStatus: BlindStatus;

	Open(): void;
	Close(): void;
	Stop(): void;
}