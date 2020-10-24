import { DeviceCollection } from "./DeviceCollection";
import { DeviceType } from "./Enums/DeviceType";
import { Trait } from "./Enums/Trait";
import { RestApi } from "./RestApi";

export class Room {
	Name: string;
	_id: string;
	Devices: DeviceCollection = new DeviceCollection();

	GetTraits(): Trait[] {
		let traits: Trait[] = [];

		for (let i in this.Devices.Items) {
			let curDev = this.Devices.Items[i];
			
			traits = [...traits, ...curDev.Traits]
		}

		return traits;
	}

	stringify(): string {
		let output: any = {
			id: this._id,
			Name: this.Name,
			Devices: RestApi.generateDeviceStructure(this.Devices.Items)
		};

		return JSON.stringify(output);
	}
}