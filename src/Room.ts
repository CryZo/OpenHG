import { IDevice } from "./interfaces/IDevice";
import { DeviceCollection } from "./DeviceCollection";
import { DeviceType } from "./Enums/DeviceType";
import { IToggleDevice } from "./interfaces/IToggleDevice";

export class Room {
	Name: string;
	_id: string;
	Devices: DeviceCollection = new DeviceCollection();

	GetDevTypes(): DeviceType[] {
		let types: DeviceType[] = [];

		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];
			
			if (!types.includes(curDev.Type))
				types.push(curDev.Type);
		}

		return types;
	}

	TurnOn(): void {
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Type == DeviceType.Toggle || curDev.Type == DeviceType.RGB) {
				(<IToggleDevice>curDev).TurnOn();
			}
		}
	}

	TurnOff(): void {
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Type == DeviceType.Toggle || curDev.Type == DeviceType.RGB) {
				(<IToggleDevice>curDev).TurnOff();
			}
		}
	}
}