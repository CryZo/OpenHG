import { IDevice } from "./IDevice";

export interface IToggleDevice extends IDevice {
	Status: boolean;

	TurnOn(): void;
	TurnOff(): void;
	Toggle(): void;
}