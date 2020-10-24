import { IDevice } from "../DeviceTypes/IDevice";

export interface IOnOff extends IDevice {
	Status: boolean;

	TurnOn(): void;
	TurnOff(): void;
	Toggle(): void;
}