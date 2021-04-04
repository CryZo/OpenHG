import { Device } from "../../";

export default interface ITemperatureSetting extends Device {
	TargetTemperature: number;
	AutomationTemperature: number;

	SetTemperature(value: number): void;
	IncreaseTemperature(): void;
	ReduceTemperature(): void;
}