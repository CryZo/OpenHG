import { Device } from "../../Device";

export interface ITemperatureSetting extends Device {
	TargetTemperature: number;

	SetTemperature(value: number): void;
	IncreaseTemperature(): void;
	ReduceTemperature(): void;
}