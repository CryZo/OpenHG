import { Color, Device } from "../../";

export default interface IRGB extends Device {
	Color: Color;

	SetColor(col: Color): void;
	GetColor(): Color;

	LightenColor(): void;
	DarkenColor(): void;
}