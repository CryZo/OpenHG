import { Device } from "../../";

export default interface IBrightness extends Device {
	Brightness: number;

	Lighten(): void;
	Darken(): void;

	SetBrightness(value: number): void;
}