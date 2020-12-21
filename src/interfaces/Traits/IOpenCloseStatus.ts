import { BlindStatus } from "../../Enums/BlindStatus";
import { Device } from "../../Device";

export interface IOpenCloseStatus extends Device {
	Status: boolean;
}