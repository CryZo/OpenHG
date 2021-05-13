import { DeviceCollection, DeviceController, RestApi } from "./";
import { DeviceType, Trait } from "./Enums";
import { IRoomStructure } from "./interfaces/Rest";
import { IHumidity, ITemperature } from "./interfaces/Traits";

export default class Room {
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

	getAverageTemperature(): number {
		let temps: number[] = [];

		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Traits.includes(Trait.Temperature)) {
				if ((<ITemperature>curDev).IsRoomTemperature)
					temps.push((<ITemperature>curDev).Temperature);
			}
		}

		if (temps.length > 0) {
			//if (temps.length == 1) {
				return temps[0];
			//}
			//TODO Implement this, if you have more than one sensor in a room
		}
	}

	getAverageHumidity(): number {
		let temps: number[] = [];

		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];

			if (curDev.Traits.includes(Trait.Humidity)) {
				temps.push((<IHumidity>curDev).Humidity);
			}
		}

		if (temps.length > 0) {
			//if (temps.length == 1) {
				return temps[0];
			//}
			//TODO Implement this, if you have more than one sensor in a room
		}
	}

	handleCommand(devType: DeviceType, cmd: string) {
		this.Devices.Items.forEach(device => {
			if (device.Type === devType) {
				DeviceController.HandleCommand(device, cmd);
			}
		});
	}

	stringify(): string {
		let output: IRoomStructure = {
			id: this._id,
			Name: this.Name,
			Floor: this.Floor,
			Devices: RestApi.generateDeviceStructure(this.Devices.Items),
			Traits: this.GetTraits()
		};

		const tempTemp = this.getAverageTemperature();
		if (tempTemp != undefined) output.Temperature = tempTemp;

		const tempHum = this.getAverageHumidity();
		if (tempHum != undefined) output.Humidity = tempHum; 

		return JSON.stringify(output);
	}
}
