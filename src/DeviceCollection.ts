import { Device } from "./Device";
import { ICollection } from "./interfaces/ICollection";

export class DeviceCollection implements ICollection {
	Items: Device[] = [];

	Add(dev: Device): void {
		this.Items.push(dev);
	}

	GetById(id: string): Device {
		for (let i in this.Items) {
			if (this.Items[i]._id == id) {
				return this.Items[i];
			}
		}

		//Not found
		throw 'Not found!'
	}
}