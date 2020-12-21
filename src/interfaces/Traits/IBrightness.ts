import { Device } from "../../Device";

export interface IBrightness extends Device {
	Brightness: number;

	Lighten(): void;
	Darken(): void;

	SetBrightness(value: number): void;
}