import { IDevice } from "../DeviceTypes/IDevice";

export interface IBrightness extends IDevice {
	Brightness: number;

	Lighten(): void;
	Darken(): void;

	SetBrightness(value: number): void;
}