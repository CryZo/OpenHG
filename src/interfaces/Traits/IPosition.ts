import { BlindStatus } from "../../Enums/BlindStatus";
import { Device } from "../../Device";

export interface IPosition extends Device {
	Position: number;

	SetPosition(pos: number): void;
}