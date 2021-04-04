import { Device } from "../../";

export default interface IPosition extends Device {
	Position: number;

	SetPosition(pos: number): void;
}