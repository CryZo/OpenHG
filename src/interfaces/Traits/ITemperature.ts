import { IDevice } from "../DeviceTypes/IDevice";

export interface ITemperature extends IDevice {
	Temperature: number;
	IsRoomTemperature: boolean;
}