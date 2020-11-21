import { IDevice } from "../DeviceTypes/IDevice";

export interface ITemperatureSetting extends IDevice {
	TargetTemperature: number;

	SetTemperature(value: number): void;
	IncreaseTemperature(): void;
	ReduceTemperature(): void;
}