import { IToggleDevice } from "./IToggleDevice";
import { Color } from "../Color";

export interface IRGBDevice extends IToggleDevice {
	Status: boolean;
	Color: Color;

	SetColor(col: Color): void;
	GetColor(): Color;

	Lighten(): void;
	Darken(): void;
}