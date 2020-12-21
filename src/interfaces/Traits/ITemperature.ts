import { Device } from "../../Device";

export interface ITemperature extends Device {
	Temperature: number;
	IsRoomTemperature: boolean;
}