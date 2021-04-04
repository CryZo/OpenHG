import { Device } from "../../";

export default interface ITemperature extends Device {
	Temperature: number;
	IsRoomTemperature: boolean;
}