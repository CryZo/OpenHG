import { Color } from "../../Color";
import { Device } from "../../Device";

export interface IRGB extends Device {
	Color: Color;

	SetColor(col: Color): void;
	GetColor(): Color;

	LightenColor(): void;
	DarkenColor(): void;
}