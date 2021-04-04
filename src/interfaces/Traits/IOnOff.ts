import { Device } from "../../";

export default interface IOnOff extends Device {
	Status: boolean;

	TurnOn(): void;
	TurnOff(): void;
	Toggle(): void;
}