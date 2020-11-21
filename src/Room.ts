import { DeviceCollection } from "./DeviceCollection";
import { DeviceController } from "./DeviceController";
import { DeviceType } from "./Enums/DeviceType";
import { Trait } from "./Enums/Trait";
import { ITemperature } from "./interfaces/Traits/ITemperature";
import { RestApi } from "./RestApi";

export class Room {
	Name: string;
	Floor: number;
	_id: string;
	Devices: DeviceCollection = new DeviceCollection();

	GetTraits(): Trait[] {
		let ret: any = {};
		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (!ret[DeviceType[curDev.Type]]) {
				ret[DeviceType[curDev.Type]] = [];
			}

			curDev.Traits.forEach(trait => {
				if (!(<Trait[]>ret[DeviceType[curDev.Type]]).includes(trait)) {
					(<Trait[]>ret[DeviceType[curDev.Type]]).push(trait)
				}
			});
		}

		return ret;
	}

	handleCommand(devType: DeviceType, cmd: string) {
		this.Devices.Items.forEach(device => {
			if (device.Type === devType) {
				DeviceController.HandleCommand(device, cmd);
			}
		});
	}

	stringify(): string {
		let output: any = {
			id: this._id,
			Name: this.Name,
			Floor: this.Floor,
			Devices: RestApi.generateDeviceStructure(this.Devices.Items),
			Traits: this.GetTraits()
		};

		let temps: number[] = [];

		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Traits.includes(Trait.Temperature)) {
				temps.push((<ITemperature>curDev).Temperature);
			}
		}

		if (temps.length > 0) {
			//if (temps.length == 1) {
				output.Temperature = temps[0];
			//}
			//TODO Implement this, if you have more than one sensor in a room
		}

		return JSON.stringify(output);
	}
}