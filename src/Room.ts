import { DeviceCollection } from "./DeviceCollection";
import { DeviceType } from "./Enums/DeviceType";
import { IToggleDevice } from "./interfaces/IToggleDevice";
import { Color } from "./Color";
import { IRGBDevice } from "./interfaces/IRGBDevice";
import { IBlinds } from "./interfaces/IBlinds";
import { IDimDevice } from "./interfaces/IDimDevice";
import { RestApi } from "./RestApi";

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

	stringify(): string {
		let output: any = {
			id: this._id,
			Name: this.Name,
			Devices: RestApi.generateDeviceStructure(this.Devices.Items)
		};

		return JSON.stringify(output);
	}

	HandleCommand(cmd: string) {
		switch (cmd) {
			case 'on':
				this.TurnOn();
				break;

			case 'off':
				this.TurnOff();
				break;

			case 'lighten':
				this.Lighten();
				break;

			case 'darken':
				this.Darken();
				break;

			case 'up':
				this.TurnUp();
				break;

			case 'down':
				this.TurnDown();
				break;

			default:
				if (cmd.length == 6) {
					this.SetColor(Color.Parse(cmd));
				}
				else if (parseInt(cmd) >= 0 && parseInt(cmd) <= 100) {
					this.SetBrightness(parseInt(cmd));
				}
				else {
					throw `Can't recognize parameter "${cmd}"!`;
				}
				break;
		}
	}


	/*
	 * Device methods
	 */
	TurnOn(): void {
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Type == DeviceType.Toggle || curDev.Type == DeviceType.RGB || curDev.Type == DeviceType.Dimmer) {
				(<IToggleDevice>curDev).TurnOn();
			}
		}
	}

	TurnOff(): void {
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Type == DeviceType.Toggle || curDev.Type == DeviceType.RGB || curDev.Type == DeviceType.Dimmer) {
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

			if (curDev.Type == DeviceType.RGB || curDev.Type == DeviceType.Dimmer) {
				(<IRGBDevice>curDev).Lighten();
			}
		}
	}

	Darken(): void {
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Type == DeviceType.RGB || curDev.Type == DeviceType.Dimmer) {
				(<IRGBDevice>curDev).Darken();
			}
		}
	}

	SetBrightness(value: number): void {
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Type == DeviceType.Dimmer) {
				(<IDimDevice>curDev).SetBrightness(value);
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