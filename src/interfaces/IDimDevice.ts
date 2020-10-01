import { IToggleDevice } from "./IToggleDevice";
import { Color } from "../Color";

export interface IDimDevice extends IToggleDevice {
	Status: boolean;
	Brightness: number;

	Lighten(): void;
	Darken(): void;

	SetBrightness(value: number): void;
}