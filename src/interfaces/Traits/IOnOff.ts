import { Device } from "../../Device";

export interface IOnOff extends Device {
	Status: boolean;

	TurnOn(): void;
	TurnOff(): void;
	Toggle(): void;
}