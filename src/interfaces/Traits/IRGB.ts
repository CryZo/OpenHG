import { Color } from "../../Color";
import { IDevice } from "../DeviceTypes/IDevice";

export interface IRGB extends IDevice {
	Color: Color;

	SetColor(col: Color): void;
	GetColor(): Color;

	LightenColor(): void;
	DarkenColor(): void;
}