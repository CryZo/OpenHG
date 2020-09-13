import { DeviceCollection } from "./DeviceCollection";
import { DeviceType } from "./Enums/DeviceType";
import { IToggleDevice } from "./interfaces/IToggleDevice";
import { Color } from "./Color";
import { IRGBDevice } from "./interfaces/IRGBDevice";
import { IBlinds } from "./interfaces/IBlinds";

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



	/*
	 * Device methods
	 */
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



	SetColor(col: Color): void {
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Type == DeviceType.RGB) {
				(<IRGBDevice>curDev).SetColor(col);
			}
		}
	}

	Lighten(): void {
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Type == DeviceType.RGB) {
				(<IRGBDevice>curDev).Lighten();
			}
		}
	}

	Darken(): void {
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Type == DeviceType.RGB) {
				(<IRGBDevice>curDev).Darken();
			}
		}
	}



	TurnUp(): void {
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Type == DeviceType.Blinds) {
				(<IBlinds>curDev).TurnUp();
			}
		}
	}

	TurnDown(): void {
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Type == DeviceType.Blinds) {
				(<IBlinds>curDev).TurnDown();
			}
		}
	}
}