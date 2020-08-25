import { IDevice } from "./interfaces/IDevice";
import { ICollection } from "./interfaces/ICollection";

export class DeviceCollection implements ICollection {
	Items: IDevice[] = [];

	Add(dev: IDevice): void {
		this.Items.push(dev);
	}

	GetById(id: string): IDevice {
		for (let i in this.Items) {
			if (this.Items[i]._id == id) {
				return this.Items[i];
			}
		}

		//Not found
		throw 'Not found!'
	}
}